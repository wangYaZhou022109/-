var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps'),
    qTypes = maps.get('question-types'),
    getCurrentStatus,
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
    orderMap = {
        1: 1,
        2: 2,
        3: 3,
        4: 6,
        5: 7,
        6: 8,
        7: 5,
        8: 4
    },
    SINGLE_CHOOSE = 1,
    MUTIPLE_CHOOSE = 2,
    JUDGE = 3,
    SORTING = 8,
    countChoose,
    countJudge,
    countSorting,
    countOther;

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
        exam: {
            url: '../exam/exam/score-detail'
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
                        currentQuestion: types.getFirstQuestion(),
                        correctNum: questionSummary.correctNum,
                        errorNum: questionSummary.errorNum,
                        noAnswerCount: questionSummary.noAnswerCount,
                        examineeTotalScore: questionSummary.totalScore
                    };
                },
                initWithSuject: function(exam) {
                    var types = this.module.store.models.types,
                        questions = exam.paper.questions;
                    this.data = {
                        name: exam.name,
                        examinee: this.app.global.currentUser.name,
                        totalCount: exam.paper.questionNum,
                        totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                        singleMode: exam.paperShowRule === constant.SINGLE_MODE,
                        currentQuestion: types.getFirstQuestion(),
                        correctNum: 0,
                        errorNum: 0,
                        noAnswerCount: 0,
                        examineeTotalScore: 0
                    };
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
                    this.data.noAnswerCount = this.data.totalCount - this.data.correctNum - this.data.errorNum;
                    this.data.examineeTotalScore = exam.examRecord.score / 100;
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
        types: {
            mixin: {
                init: function(questions) {
                    var map = {},
                        j = 0,
                        me = this;

                    if (questions) {
                        _.forEach(questions, function(q) {
                            var type = orderMap[q.type];

                            if (!map[type]) {
                                map[type] = {};
                                D.assign(map[type], {
                                    type: type,
                                    name: _.find(qTypes, ['key', q.type.toString()]).value,
                                    totalScore: constant.ZERO,
                                    size: constant.ZERO,
                                    status: itemStatus.INIT,
                                    questions: []
                                });
                            }
                            map[type].size++;
                            map[type].questions.push(D.assign(q, {
                                index: map[type].questions.length + constant.ONE,
                                score: q.score / constant.ONE_HUNDRED,
                                status: itemStatus.INIT
                            }));
                        });

                        this.data = _.map(map, function(o) {
                            if (j === constant.ZERO) {
                                D.assign(o.questions[0], { status: itemStatus.CURRENT });
                            }
                            _.map(o.questions, function(q) {
                                D.assign(q, {
                                    totalCount: o.size,
                                    status: getCurrentStatus.call(me, q.id)
                                });
                            });

                            return D.assign(o, {
                                totalScore: _.reduce(_.map(o.questions, 'score'), function(sum, n) {
                                    return sum + n;
                                }),
                                isCurrent: true
                            });
                        });
                    }
                },
                getQuestionById: function(id) {
                    var question;
                    _.forEach(this.data, function(d) {
                        _.forEach(d.questions, function(q) {
                            if (q.id === id) question = q;
                        });
                    });
                    return D.assign(question, {
                        typeDesc: _.find(qTypes, ['key', question.type.toString()]).value + '题'
                    });
                },
                getFirstQuestion: function() {
                    var question = this.data[0].questions[0];
                    return D.assign(question, {
                        typeDesc: _.find(qTypes, ['key', question.type.toString()]).value + '题'
                    });
                },
                selectType: function(id) {
                    if (!this.module.store.models.state.data.selectQuestion) {
                        this.data[id].isCurrent = !this.data[id].isCurrent;
                    }
                    this.module.store.models.state.data.selectQuestion = false;
                },
                getType: function(questionId) {
                    return _.find(this.data, function(d) {
                        return _.some(d.questions, function(q) {
                            return q.id === questionId;
                        });
                    });
                },
                selectQuestion: function(id) {
                    var type = this.getType(id),
                        index = type.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        }),
                        me = this;

                    if (index > -1) {
                        type.questions[index].status = getCurrentStatus.call(me, type.questions[index].id);
                    }
                    D.assign(this.getQuestionById(id), {
                        status: itemStatus.CURRENT
                    });

                    //  把其他类型的题目的current 设置为其他状态
                    _.forEach(_.filter(this.data, function(t) {
                        return _.every(t.questions, function(q) {
                            return q.id !== id;
                        });
                    }), function(tt) {
                        var n = tt.questions.findIndex(function(qq) {
                            return qq.status === itemStatus.CURRENT;
                        });
                        if (n !== -1) {
                            D.assign(tt.questions[n], { status: getCurrentStatus.call(me, tt.questions[n].id) });
                        }
                    });
                    this.module.store.models.state.data.selectQuestion = true;
                },
                getCurrentQuestion: function() {
                    var question;
                    _.forEach(this.data, function(t) {
                        _.forEach(t.questions, function(q) {
                            if (q.status === itemStatus.CURRENT) {
                                question = q;
                            }
                        });
                    });
                    return question;
                },
                move: function(payload) {
                    var type = this.data[payload.id],
                        index = type.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        }),
                        question = type.questions[index + payload.offset];
                    if (question) {
                        question.status = itemStatus.CURRENT;
                        type.questions[index].status = getCurrentStatus.call(this, type.questions[index].id);
                    }
                },
                initStatus: function() {
                    this.data = _.map(this.data, function(t) {
                        return D.assign(t, {
                            isCurrent: true
                        });
                    });
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
                            } else {
                                values = subjective(q);
                            }
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
            if (data) {
                this.models.exam.set(data.exam);
                this.models.types.set(data.types);
                this.models.types.initStatus();
                this.models.answer.set(data.answer);
                this.models.state.initNoSujective(data.exam);
            } else {
                D.assign(this.models.exam.params, payload);
                return this.get(this.models.exam).then(function() {
                    var exam = me.models.exam.data;
                    me.models.answer.init(exam.paper.questions);
                    me.models.types.init(exam.paper.questions);
                    me.models.state.initWithSuject(exam);
                });
            }
            return '';
        },
        selectType: function(payload) {
            this.models.types.selectType(payload.id);
            this.models.types.changed();
        },
        selectQuestion: function(payload) {
            this.models.state.selectQuestion(payload.id);
            this.models.types.selectQuestion(payload.id);
            this.models.state.changed();
            this.models.types.changed();
        },
        move: function(payload) {
            this.models.types.move(payload);
            this.models.types.changed();
            this.models.state.resetCurrentQuestion();
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

getCurrentStatus = function(id) {
    var answer = this.store.models.answer.data,
        o = _.find(answer, ['key', id]);
    if (o && o.value.length > 0) {
        return itemStatus.ACTIVE;
    }
    return itemStatus.INIT;
};

countChoose = function(question, answer, r) {
    var mutipleAnswer = [],
        isCorrect,
        result = r;

    if (!answer) {
        D.assign(question, { gainScore: 0 });
        D.assign(result, { noAnswerCount: ++result.noAnswerCount });
    } else {
        if (question.type === 1) {
            if (_.find(question.questionAttrCopys, ['name', answer.value[0].value]).type === 1) {
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
    if (!answer) {
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
    if (!answer) {
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
    if (!answer) {
        D.assign(result, { noAnswerCount: result.noAnswerCount++ });
    }
    return result;
};
