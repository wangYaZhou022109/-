var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps'),
    qTypes = maps.get('question-types'),
    constant = {
        ONE_HUNDRED: 100,
        ZERO: 0,
        ONE: 1,
        SINGLE_MODE: 1,
        PC_CLIENT_TYPE: 1,
        SHOW_ANSWER_IMMED: 1
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

exports.large = true;

exports.items = {
    side: 'side',
    main: 'main'
};

exports.store = {
    models: {
        state: {
            mixin: {
                init: function(exam) {
                    var types = this.module.store.models.types;
                    this.data = {
                        name: exam.name,
                        examNotes: exam.examNotes,
                        examinee: exam.examRecord && exam.examRecord.member.name,
                        totalCount: exam.paper.questionNum,
                        totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                        noAnswerCount: exam.paper.questionNum,
                        answeredCount: constant.ZERO,
                        singleMode: Number(exam.paperShowRule) === constant.SINGLE_MODE,
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
                },
                isComplete: function() {
                    return this.data.noAnswerCount === 0;
                },
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
                                D.assign(q, {
                                    typeIndex: j,
                                    totalCount: o.size,
                                    questionAttrCopys: _.orderBy(q.questionAttrCopys, ['name'], ['asc'])
                                });
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
                            return D.assign(t, {
                                questions: _.map(t.questions.sort(function() {
                                    return Math.random() - 0.5;
                                }), function(q, i) {
                                    return D.assign(q, { index: i + 1 });
                                })
                            });
                        });
                    }

                    if (paperSortRule === sort.QUESTION_ATTR) {
                        this.data = _.map(this.data, function(t) {
                            return D.assign(t, {
                                questions: _.map(t.questions, function(q) {
                                    return D.assign(q, {
                                        questionAttrCopys: q.questionAttrCopys.sort(function() {
                                            return Math.random() - 0.5;
                                        })
                                    });
                                })
                            });
                        });
                    }

                    if (paperSortRule === sort.QUESTION_AND_ATTR) {
                        this.data = _.map(this.data, function(t) {
                            return D.assign(t, {
                                questions: _.map(t.questions.sort(function() {
                                    return Math.random() - 0.5;
                                }), function(q, i) {
                                    return D.assign(q, {
                                        index: i + 1,
                                        questionAttrCopys: q.questionAttrCopys.sort(function() {
                                            return Math.random() - 0.5;
                                        })
                                    });
                                })
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
                        type.questions[index].status =
                            this.module.options.getCurrentStatus.call(this.module, type.questions[index].id);
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
                            D.assign(tt.questions[n], {
                                status: me.module.options.getCurrentStatus.call(me.module, tt.questions[n].id)
                            });
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
                        offset = payload.offset,
                        question = type.questions[index + offset],
                        temp;

                    if (question) {
                        question.status = itemStatus.CURRENT;
                        type.questions[index].status =
                            this.module.options.getCurrentStatus.call(this.module, type.questions[index].id);
                    } else if (this.data[Number(payload.id) + offset]) {
                        temp = this.data[Number(payload.id) + offset];
                        question = temp.questions[offset > 0 ? 0 : temp.questions.length - 1];
                        question.status = itemStatus.CURRENT;
                        this.initStatus();
                        temp.isCurrent = true;
                        type.questions[index].status =
                            this.module.options.getCurrentStatus.call(this.module, type.questions[index].id);
                    }
                },
                updateStatus: function(questionId, status) {
                    D.assign(this.getQuestionById(questionId), {
                        status: status
                    });
                },
                initStatus: function() {
                    this.data = _.map(this.data, function(t) {
                        return D.assign(t, {
                            isCurrent: false
                        });
                    });
                }
            }
        }
    },
    callbacks: {
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
        },
        clearModels: function() {
            _.forEach(this.models, function(m) {
                m.clear();
            });
        }
    }
};


exports.getCurrentStatus = function() {
    return itemStatus.INIT;
};
