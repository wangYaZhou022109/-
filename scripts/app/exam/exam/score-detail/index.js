var options = require('./app/exam/exam/base-paper/index'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    constant = {
        ONE_HUNDRED: 100,
        ZERO: 0,
        ONE: 1,
        SINGLE_MODE: 1,
        PC_CLIENT_TYPE: 1
    },
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    SINGLE_CHOOSE = 1,
    MUTIPLE_CHOOSE = 2,
    JUDGE = 3,
    SORTING = 8,
    countChoose,
    countJudge,
    countSorting,
    countOther,
    NO_SHOW_ANYTHING = -1;

var setOptions = {
    store: {
        models: {
            exam: {
                url: '../exam/exam/front/score-detail'
            },
            state: {
                mixin: {
                    initNoSujective: function(exam) {
                        var types = this.module.store.models.types,
                            answer = this.module.store.models.answer,
                            questionSummary = answer.questionSummary();
                        this.data = {
                            name: exam.name,
                            examinee: this.app.global.currentUser.name,
                            totalCount: exam.paper.questionNum,
                            totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                            singleMode: exam.paperShowRule === constant.SINGLE_MODE,
                            examineeTotalScore: 0,
                            hasPrevious: false,
                            hasNext: exam.paper.questions.length > 1
                        };

                        //  查看详情全部不显示模式
                        if (exam.showAnswerRule !== NO_SHOW_ANYTHING) {
                            D.assign(this.data, {
                                currentQuestion: types.getFirstQuestion(),
                                correctNum: questionSummary.correctNum,
                                errorNum: questionSummary.errorNum,
                                noAnswerCount: questionSummary.noAnswerCount,
                            });
                        }

                        //  这里是马上查看详情，或者 点击查看详情，答案没有算完分，试卷全部是客观题
                        if (exam.examRecord.status > 5 || exam.paper.isSubjective === 0) {
                            D.assign(this.data, {
                                examineeTotalScore: questionSummary.totalScore
                            });
                        }
                    },
                    initWithSuject: function(exam) {
                        var types = this.module.store.models.types,
                            questions = exam.paper.questions,
                            answeredCount = 0;

                        D.assign(this.data, exam, {
                            name: exam.name,
                            examinee: this.app.global.currentUser.name,
                            totalCount: exam.paper.questionNum,
                            totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                            singleMode: exam.paperShowRule === constant.SINGLE_MODE,
                            currentQuestion: types.getFirstQuestion(),
                            correctNum: 0,
                            errorNum: 0,
                            noAnswerCount: 0,
                            examineeTotalScore: 0,
                            hasPrevious: false,
                            hasNext: exam.paper.questions.length > 1
                        });

                        if (exam.showAnswerRule !== NO_SHOW_ANYTHING && exam.examRecord.status >= 5) {
                            this.data.correctNum = _.filter(questions, function(q) {
                                if (q.type === 6) {
                                    return _.every(q.subs, function(s) {
                                        return s.answerRecord && s.answerRecord.isRight === 1;
                                    });
                                }
                                if (q.answerRecord) {
                                    return q.answerRecord.isRight === 1;
                                }
                                return false;
                            }).length;

                            this.data.errorNum = _.filter(questions, function(q) {
                                if (q.type === 6) {
                                    return !_.every(q.subs, function(s) {
                                        return s.answerRecord && s.answerRecord.isRight === 1;
                                    });
                                }
                                if (q.answerRecord) {
                                    return q.answerRecord.isRight === 0;
                                }
                                return false;
                            }).length;

                            _.forEach(questions, function(q) {
                                if (q.type === 6 && _.some(q.subs, function(s) {
                                    return s.answerRecord && s.answerRecord.answer;
                                })) {
                                    answeredCount++;
                                } else if (q.answerRecord && q.answerRecord.answer) {
                                    answeredCount++;
                                }
                            });
                            this.data.noAnswerCount = this.data.totalCount - answeredCount;

                            this.data.examineeTotalScore = _.reduce(_.map(_.filter(questions, function(q) {
                                return q.type !== 4 && q.type !== 5;
                            }), function(q) {
                                if (q.type === 6) {
                                    return _.reduce(_.map(_.filter(q.subs, function(s) {
                                        return s.type !== 5;
                                    }), function(s) {
                                        return s.answerRecord ? s.answerRecord.score / 100 : 0;
                                    }), function(sum, n) {
                                        return sum + n;
                                    });
                                }
                                return q.answerRecord ? q.answerRecord.score / 100 : 0;
                            }), function(sum, n) {
                                return sum + n;
                            });
                        }
                        if (exam.showAnswerRule !== exam.NO_SHOW_ANYTHING && exam.examRecord.status > 5) {
                            this.data.examineeTotalScore = exam.examRecord.score / 100;
                        }
                    },
                    selectQuestion: function(id) {
                        var types = this.module.store.models.types;
                        D.assign(this.data, { currentQuestion: types.getQuestionById(id) });
                    },
                    resetCurrentQuestion: function() {
                        var types = this.module.store.models.types;
                        D.assign(this.data, { currentQuestion: types.getCurrentQuestion() });
                    }
                }
            },
            answer: {
                mixin: {
                    getAnswer: function(questionId) {
                        return _.find(this.data, ['key', questionId]);
                    },
                    questionSummary: function() {
                        var result = {
                                correctNum: 0,
                                errorNum: 0,
                                noAnswerCount: 0,
                                totalScore: 0
                            },
                            types = this.module.store.models.types.data,
                            me = this;
                        _.forEach(types, function(t) {
                            _.forEach(t.questions, function(q) {
                                var answer = _.find(me.data, ['key', q.id]);
                                if (q.type === SINGLE_CHOOSE || q.type === MUTIPLE_CHOOSE) {
                                    result = countChoose.call(me, q, answer, result);
                                } else if (q.type === JUDGE) {
                                    result = countJudge.call(me, q, answer, result);
                                } else if (q.type === SORTING) {
                                    result = countSorting.call(me, q, answer, result);
                                } else {
                                    result = countOther.call(me, q, answer, result);
                                }
                            });
                        });
                        return result;
                    },
                    init: function(questions) {
                        var choose = function(question) {
                                return _.map(question.answerRecord.answer.split(','), function(n) {
                                    return {
                                        id: _.find(question.questionAttrCopys, ['name', n]).id,
                                        value: n
                                    };
                                });
                            },
                            subjective = function(question) {
                                return [{ id: question.id, value: question.answerRecord.answer }];
                            };
                        this.data = _.map(questions, function(q) {
                            var values = [];
                            if (q.answerRecord) {
                                if (q.type === 1 || q.type === 2) {
                                    values = choose(q);
                                } else {
                                    values = subjective(q);
                                }
                            } else if (q.type === 6) {
                                values = _.map(q.subs, function(s) {
                                    var subValues = [];
                                    if (s.answerRecord) {
                                        if (s.type === 1 || s.type === 2) {
                                            subValues = choose(s);
                                        } else {
                                            subValues = subjective(s);
                                        }
                                    }
                                    return { key: s.id, value: subValues };
                                });
                            }
                            return { key: q.id, value: values };
                        });
                    }
                }
            }
        },
        callbacks: {
            init: function(payload) {
                var data = payload.data,
                    me = this;

                this.module.dispatch('clearModels');
                if (data) {
                    this.models.exam.set(data.exam);
                    this.models.types.set(data.types);
                    this.models.types.initStatus();
                    this.models.answer.set(data.answer);
                    this.models.state.initNoSujective(data.exam);
                } else {
                    D.assign(this.models.exam.params, payload);
                    return this.get(this.models.exam, { loading: true }).then(function() {
                        var exam = me.models.exam.data;
                        if (exam.showAnswerRule !== NO_SHOW_ANYTHING) {
                            me.models.answer.init(exam.paper.questions);
                        }
                        me.models.types.init(exam.paper.questions);
                        //  兼容提交试卷后，考试纪录排队列存储，状态还没有改变
                        if (exam.examRecord.status < 5) {
                            me.models.state.initNoSujective(exam);
                        } else {
                            me.models.state.initWithSuject(exam);
                        }
                    });
                }
                return '';
            }
        }
    }
};

var models = D.assign({}, options.store.models);
var callbacks = D.assign({}, options.store.callbacks);
var target = D.assign({}, {
    items: options.items,
    store: {
        models: D.assign(models, setOptions.store.models),
        callbacks: D.assign(callbacks, setOptions.store.callbacks)
    },
    beforeRender: function() {
        return this.dispatch('init', this.renderOptions);
    },
    getCurrentStatus: function(id) {
        var answer = this.store.models.answer.data,
            o = _.find(answer, ['key', id]);
        if (o && o.value.length > 0) {
            return itemStatus.ACTIVE;
        }
        return itemStatus.INIT;
    }
});

module.exports = target;


countChoose = function(question, answer, r) {
    var mutipleAnswer = [],
        isCorrect,
        result = r;

    if (!answer || answer.value.length === 0) {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { noAnswerCount: ++result.noAnswerCount });
    } else {
        if (question.type === 1) {
            if (_.find(question.questionAttrCopys, ['name', answer.value[0].value]).type === 0) {
                D.assign(question, { gainScore: question.score });
                D.assign(result, {
                    correctNum: ++result.correctNum,
                    totalScore: result.totalScore + question.score
                });
            } else {
                D.assign(question, { gainScore: 0 });
                D.assign(result, { errorNum: ++result.errorNum });
            }
        }

        if (question.type === 2) {
            mutipleAnswer = _.filter(question.questionAttrCopys, function(o) {
                return o.type === 0;
            });
            if (answer.value.length === mutipleAnswer.length) {
                isCorrect = _.every(mutipleAnswer, function(a) {
                    if (_.find(answer.value, ['value', a.name])) {
                        return true;
                    }
                    return false;
                });
                if (isCorrect) {
                    D.assign(question, { gainScore: question.score });
                    D.assign(result, {
                        correctNum: ++result.correctNum,
                        totalScore: result.totalScore + question.score
                    });
                } else {
                    D.assign(question, { gainScore: 0 });
                    D.assign(result, { errorNum: ++result.errorNum });
                }
            } else {
                D.assign(question, { gainScore: 0 });
                D.assign(result, { errorNum: ++result.errorNum });
            }
        }
    }
    return result;
};

countJudge = function(question, answer, r) {
    var result = r;
    if (!answer || answer.value.length === 0) {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { noAnswerCount: ++result.noAnswerCount });
    } else if (answer.value[0].value === question.questionAttrCopys[0].value) {
        D.assign(question, { gainScore: question.score });
        D.assign(result, {
            correctNum: ++result.correctNum,
            totalScore: result.totalScore + question.score
        });
    } else {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { errorNum: ++result.errorNum });
    }

    return result;
};

countSorting = function(question, answer, r) {
    var result = r;
    if (!answer || answer.value.length === 0) {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { noAnswerCount: ++result.noAnswerCount });
    } else if (_.find(question.questionAttrCopys, ['type', '0']).value === answer.value[0].value) {
        D.assign(question, { gainScore: question.score });
        D.assign(result, {
            correctNum: ++result.correctNum,
            totalScore: result.totalScore + question.score
        });
    } else {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { errorNum: ++result.errorNum });
    }

    return result;
};

countOther = function(question, answer, r) {
    var result = r;
    if (!answer || answer.value.length === 0) {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { noAnswerCount: ++result.noAnswerCount });
    } else if (!answer) {
        D.assign(result, { noAnswerCount: ++result.noAnswerCount });
    }
    return result;
};
