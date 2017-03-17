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
    sort = {
        REMOTE: 1,
        QUESTION: 2,
        QUESTION_ATTR: 3,
        QUESTION_AND_ATTR: 4
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
    };

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
        exam: {
            url: '../exam/exam/exam-paper'
        },
        state: {
            mixin: {
                init: function(exam) {
                    var types = this.module.store.models.types;
                    this.data = {
                        name: exam.name,
                        totalCount: exam.paper.questionNum,
                        totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                        noAnswerCount: exam.paper.questionNum,
                        answeredCount: constant.ZERO,
                        singleMode: exam.paperShowRule === constant.SINGLE_MODE,
                        currentQuestion: types.getFirstQuestion()
                    };
                },
                selectQuestion: function(id) {
                    var types = this.module.store.models.types;
                    D.assign(this.data, { currentQuestion: types.getQuestionById(id) });
                },
                resetCurrentQuestion: function() {
                    var types = this.module.store.models.types;
                    D.assign(this.data, { currentQuestion: types.getCurrentQuestion() });
                },
                calculate: function() {
                    var answer = this.module.store.models.answer,
                        answeredCount = answer.answeredCount();
                    D.assign(this.data, {
                        answeredCount: answeredCount,
                        noAnswerCount: this.data.totalCount - answeredCount
                    });
                }
            }
        },
        types: {
            mixin: {
                init: function(questions) {
                    var map = {},
                        j = 0;

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
                                D.assign(q, { totalCount: o.size });
                            });

                            return D.assign(o, {
                                totalScore: _.reduce(_.map(o.questions, 'score'), function(sum, n) {
                                    return sum + n;
                                }),
                                isCurrent: j++ === constant.ZERO
                            });
                        });
                        this.sortQuestion();
                    }
                },
                sortQuestion: function() {
                    var exam = this.module.store.models.exam.data,
                        paperSortRule = exam.paperSortRule;
                    if (paperSortRule === sort.QUESTION) {
                        this.data = _.map(this.data, function(t) {
                            return _.map(t.questions.sort(function() {
                                return Math.random() - 0.5;
                            }), function(q, i) {
                                return D.assign(q, { index: i + 1 });
                            });
                        });
                    }

                    if (paperSortRule === sort.QUESTION_ATTR) {
                        this.data = _.map(this.data, function(t) {
                            return _.map(t.questions, function(q) {
                                return D.assign(q, {
                                    questionAttrCopys: q.questionAttrCopys.sort(function() {
                                        return Math.random() - 0.5;
                                    })
                                });
                            });
                        });
                    }

                    if (paperSortRule === sort.QUESTION_AND_ATTR) {
                        this.data = _.map(this.data, function(t) {
                            return _.map(t.questions.sort(function() {
                                return Math.random() - 0.5;
                            }), function(q, i) {
                                return D.assign(q, {
                                    index: i + 1,
                                    questionAttrCopys: q.questionAttrCopys.sort(function() {
                                        return Math.random() - 0.5;
                                    })
                                });
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
                    var currentIndex = this.data.findIndex(function(d) {
                        return d.isCurrent;
                    });
                    if (currentIndex > -1) {
                        this.data[currentIndex].isCurrent = false;
                        this.data[id].isCurrent = true;
                    } else {
                        this.data[id].isCurrent = true;
                    }
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
                        });
                    if (index > -1) {
                        type.questions[index].status = getCurrentStatus.call(this, id);
                    }
                    D.assign(this.getQuestionById(id), {
                        status: itemStatus.CURRENT
                    });
                },
                getCurrentQuestion: function() {
                    var type = _.find(this.data, ['isCurrent', true]);
                    return _.find(type.questions, ['status', itemStatus.CURRENT]);
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
                            questions: _.map(t.questions, function(q) {
                                return D.assign(q, { status: itemStatus.INIT });
                            })
                        });
                    });
                }
            }
        },
        answer: {
            mixin: {
                init: function() {
                    this.data = [];
                    this.save();
                },
                saveAnswer: function(data) {
                    this.data = _.reject(this.data, ['key', data.key]);
                    this.data.push(data);
                    this.save();
                },
                answeredCount: function() {
                    return _.filter(this.data, function(a) {
                        var readingQuetion = !_.every(a.value, function(sub) {
                                return sub.value.length === 0 || sub.value[0].value === '';
                            }),
                            otherQuestion = a.value[0].value !== '';
                        return Number(a.type) === 6 ? readingQuetion : otherQuestion;
                    }).length;
                },
                getAnswer: function(questionId) {
                    return _.find(this.data, ['key', questionId]);
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var data = payload.data,
                exam;
            if (!payload.examRecordId) {
                exam = data.exam;
                this.models.exam.set(data.exam);
                this.models.types.set(data.types);
                this.models.types.initStatus();
                this.models.state.init(exam);
                this.models.answer.set(data.answer);
            }
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

getCurrentStatus = function() {
    return itemStatus.INIT;
};

