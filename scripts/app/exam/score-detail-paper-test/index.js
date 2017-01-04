var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    $ = require('jquery'),
    map = {
        1: 1,
        2: 2,
        3: 3,
        4: 6,
        5: 7,
        6: 8,
        7: 5,
        8: 4
    },
    changeToFullScreen;


exports.items = {
    side: 'side',
    main: 'main',
    head: 'head',
    tips: ''
};

exports.store = {
    models: {
        state: {
            data: { isOnePageOneQuestion: true },
            mixin: {
                getCurrentState: function(questionTypes) {
                    var data = {
                            questionType: '',
                            questionIndex: 0,
                            questionTotalInType: 0,
                            currentQuestionScore: 0
                        },
                        t = _.find(questionTypes, ['isCurrent', true]),
                        q;
                    data.questionType = t.data.name;
                    data.questionTotalInType = t.data.data.length;
                    q = _.find(t.data.data, ['isCurrent', true]);
                    if (!q) {
                        data.questionIndex = 1;
                        data.currentQuestionScore = t.data.data[0].score;
                    } else {
                        data.questionIndex = q.i;
                        data.currentQuestionScore = q.score;
                        data.questionId = q.id;
                    }
                    D.assign(this.data, data);
                    return true;
                },
                setFirstQuestionRemote: function(questionTypes) {
                    this.data.questionId = questionTypes[0].data.data[0].id;
                },
                init: function(exam, payload) {
                    var data = this.data,
                        questions = exam.paper.questions;

                    D.assign(data, {
                        name: exam.name,
                        isOnePageOneQuestion: exam.paperShowRule === 1,
                        mode: payload.mode || 1,
                        questionNum: exam.paper.questionNum,
                        totalScore: exam.paper.totalScore / 100,
                        examMember: exam.examRecord.member.name,
                        memberTotalScore: exam.examRecord.score / 100,
                        passDec: exam.examRecord.status < 7 ? '及格' : '不及格'
                    });

                    data.rightNum = _.filter(questions, function(q) {
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

                    data.wrongNum = _.filter(questions, function(q) {
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
                    data.noAnswerNum = data.questionNum - data.rightNum - data.wrongNum;
                }
            }
        },
        exam: {
            url: '../exam/exam/score-detail-paper',
            mixin: {
                getQuestionById: function(id) {
                    var questions = this.data.paper.questions;
                    return _.find(questions, ['id', id]);
                }
            }
        },
        questionTypes: {
            mixin: {
                createQuestionTypes: function(paper) {
                    var result = [],
                        obj = {},
                        questions = [],
                        qq,
                        type,
                        n = 0,
                        types = maps.get('question-types');
                    if (paper.questions && paper.questions.length > 0) {
                        _.forEach(paper.questions, function(q) {
                            type = map[q.type];
                            if (!obj[type]) {
                                obj[type] = { size: 0, totalScore: 0, name: '', data: [] };
                            }
                            obj[type].size++;
                            obj[type].totalScore += q.score / 100;
                            obj[type].name = types[Number(q.type) - 1].value;
                            qq = {
                                id: q.id,
                                i: obj[type].data.length + 1,
                                score: q.score / 100,
                                isCurrent: false
                            };
                            obj[type].data.push(qq);
                            questions.push(qq);
                        });
                        _.forEach(obj, function(v, k) {
                            result.push({ data: obj[k], isCurrent: false, k: n });
                        });
                    }
                    this.store.models.questions.set(questions);
                    this.data = result;
                },
                setFirstQuestionRemote: function() {
                    var questionTypes = this.data;
                    questionTypes[0].isCurrent = true;
                    questionTypes[0].data.data[0].isCurrent = true;
                },
                move: function(index) {
                    var questionTypes = this.data,
                        state = this.store.models.state,
                        questionType = _.find(questionTypes, ['isCurrent', true]),
                        questions, q, z;
                    if (questionType) {
                        questions = questionType.data.data;
                        q = _.find(questions, ['isCurrent', true]);
                        z = (q.i - 1) + index;
                        if (questions[z]) {
                            questions[z].isCurrent = true;
                            state.data.questionId = questions[z].id;
                            questions[q.i - 1].isCurrent = false;
                        } else {
                            this.app.message.error('已超出该类型题目范围');
                            return false;
                        }
                    }
                    return this.store.models.state.getCurrentState(questionTypes);
                },
                click: function(payload) {
                    var questionTypes = this.data,
                        typeIndex = payload.typeIndex,
                        questionId = payload.questionId,
                        questions, q;
                    if (typeIndex >= 0) {
                        _.forEach(questionTypes, function(t) {
                            var tt = t;
                            tt.isCurrent = false;
                            _.forEach(tt.data.data, function(qqq) {
                                var qqqq = qqq;
                                qqqq.isCurrent = false;
                            });
                        });
                        questionTypes[typeIndex].isCurrent = true;
                    }
                    questions = _.find(questionTypes, ['isCurrent', true]).data.data;
                    if (questionId) {
                        q = _.find(questions, ['id', questionId]);
                        if (q) {
                            _.forEach(questions, function(qq) {
                                var question = qq;
                                question.isCurrent = false;
                            });
                            q.isCurrent = true;
                        }
                    } else {
                        questions[0].isCurrent = true;
                    }
                },
                getQuestionIndexInType: function(id) {
                    var result = this.data,
                        i = 0,
                        j = 0,
                        question,
                        questions,
                        index = 0;
                    for (i; i < this.data.length; i++) {
                        questions = result[i].data.data;
                        question = _.find(questions, ['id', id]);
                        if (question) {
                            for (j; j < questions.length; j++) {
                                if (questions[j].id === id) {
                                    index = j + 1;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    return index;
                }
            }
        },
        questions: {},
        side: { data: {} },
        answer: {
            data: { answers: [] },
            mixin: {
                getAnswer: function(id) {
                    return _.find(this.data.answers, ['key', id]);
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
                    this.data.answers = _.map(questions, function(q) {
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
            var me = this,
                questionTypes = this.models.questionTypes;
            this.models.exam.params = {
                examRecordId: payload.examRecordId
            };

            return this.get(this.models.exam).then(function() {
                var exam = me.models.exam.data,
                    state = me.models.state;

                state.init(exam, payload);
                me.models.answer.init(exam.paper.questions);

                questionTypes.createQuestionTypes(exam.paper);
                questionTypes.setFirstQuestionRemote();
                me.models.state.getCurrentState(questionTypes.data);
                me.models.state.setFirstQuestionRemote(questionTypes.data);
            });
        },
        reload: function() {
            this.models.state.changed();
        },
        changeState: function(payload) {
            var data = this.models.state.data,
                side = this.models.side;
            D.assign(data, payload);
            D.assign(side.data, payload);
            this.models.questionTypes.click(side.data);
            this.models.state.getCurrentState(this.models.questionTypes.data);
            this.models.state.changed();
        },
        move: function(payload) {
            this.models.questionTypes.move(payload);
            this.models.questionTypes.changed();
            this.models.state.changed();
        },
        changePaperViewType: function(payload) {
            this.models.state.data.isOnePageOneQuestion = Number(payload.type) === 0;
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.afterRender = function() {
    changeToFullScreen();
};

changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
