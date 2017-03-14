var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    E = require('./app/exam/exam-websocket'),
    maps = require('./app/util/maps'),
    qTypes = maps.get('question-types'),
    strings = require('./app/util/strings'),
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
    submitType = {
        Auto: 'Auto',
        Hand: 'Hand'
    },
    WS,
    TO,
    changeScreen;

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
        exam: {
            type: 'localStorage',
            url: '../exam/exam/exam-mark-paper/front'
        },
        state: {
            type: 'localStorage',
            mixin: {
                init: function(exam) {
                    var types = this.module.store.models.types;
                    this.load();
                    if (!this.data) {
                        this.data = {
                            name: exam.name,
                            totalCount: exam.paper.questionNum,
                            totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                            noAnswerCount: exam.paper.questionNum,
                            answeredCount: constant.ZERO,
                            singleMode: exam.paperShowRule === constant.SINGLE_MODE,
                            currentQuestion: types.getFirstQuestion()
                        };
                        this.save();
                    }
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
            type: 'localStorage',
            mixin: {
                init: function(questions) {
                    var map = {},
                        j = 0;

                    this.load();
                    if (!this.data && questions) {
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

                        this.save();
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
                        type.questions[index].status = itemStatus.INIT;
                    }
                    D.assign(this.getQuestionById(id), {
                        status: itemStatus.CURRENT
                    });
                    this.save();
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
                        type.questions[index].status = itemStatus.INIT;
                    }
                }
            }
        },
        form: {
            url: '../exam/exam-record/submitPaper'
        }
    },
    callbacks: {
        init: function(payload) {
            var exam = this.models.exam,
                types = this.models.types,
                state = this.models.state;

            exam.load();
            if (!exam.data || (exam.data && exam.data.examRecord.id !== payload.examRecordId)) {
                exam.clear();
                types.clear();
                state.clear();
                D.assign(exam.params, { examRecordId: payload.examRecordId });
                return this.get(exam).then(function() {
                    exam.save();
                    types.init(exam.data.paper.questions);
                    state.init(exam.data);
                });
            }
            types.init(exam.data.paper.questions);
            state.init(exam.data);
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
        },
        saveAnswer: function(payload) {
            this.models.answer.saveAnswer(payload);
            this.models.modify.saveAnswer(payload);
            this.models.state.calculate();
            this.models.state.changed();
        },
        waitingCheck: function(payload) {
            this.models.mark.waitingCheck(payload.questionId);
            this.app.message.success(strings.get('operation-success'));
        },
        submitPaper: function(payload) {
            var me = this,
                examRecordId = this.module.store.models.exam.data.examRecord.id,
                data = {
                    examRecordId: examRecordId,
                    submitType: payload.submitType,
                    answerRecords: this.models.modify.changeAnswerRecord(),
                    clientType: constant.PC_CLIENT_TYPE
                };

            if (payload.submitType !== submitType.Auto) TO.cancel();

            this.models.form.set(data);
            return this.post(this.models.form).then(function() {
                if (payload.submitType === submitType.Auto) {
                    this.app.message.success('答案已自动保存成功');
                    me.models.modify.clear();
                } else {
                    me.models.exam.clear();
                    me.models.state.clear();
                    me.models.types.clear();
                    me.models.mark.clear();
                    me.models.answer.clear();
                    me.models.modify.clear();
                    this.app.message.success('交卷成功');
                    setTimeout(window.close, 500);
                }
            });
        },
        lowerSwitchTimes: function() {
            var exam = this.models.exam.data;
            if (exam.allowSwitchTimes) {
                if (exam.allowSwitchTimes === exam.lowerSwitchTimes + 1) {
                    this.app.message.error('切屏次数已满，强制交卷');
                    // return this.module.dispatch('submitPaper', { submitType: submitType.Hand }).then(function() {
                    //     WS.closeConnect();
                    // });
                }
                D.assign(exam, {
                    lowerSwitchTimes: (exam.lowerSwitchTimes || 0) + 1
                });
                this.models.exam.save();
                this.app.message.success('还剩余' + (exam.allowSwitchTimes - exam.lowerSwitchTimes) + '次切屏');
            }
            return true;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};


exports.afterRender = function() {
    var me = this,
        examId = this.store.models.exam.data.id,
        getRandom = function() {
            var r = Math.random() * 1,
                min = Number(r.toFixed(2)),
                ms = (min + 1) * (1000 * 60);
            return ms;
        },
        f = true,
        autoSubmit = function() {
            return me.dispatch('submitPaper', { submitType: submitType.Auto }).then(function() {
                TO.timeOutId = setTimeout(autoSubmit, getRandom());
            });
        };

    if (f) {
        autoSubmit();

        TO.timeOutId = setTimeout(autoSubmit, getRandom());

        WS.connect(examId, function() {
            me.app.message.error('你本次考试已被管理员强制交卷');
            return me.dispatch('submit', { submitType: submitType.Hand }).then(function() {
                WS.closeConnect();
            });
        }, function(delay) {
            return me.dispatch('delay', { delay: Number(delay) });
        });
    }
    changeScreen.call(this);
};

WS = {
    connect: function(examId, submitPaper, timeExpand) {
        E.connect(examId, {
            submitPaper: submitPaper,
            timeExpand: timeExpand
        });
    },
    closeConnect: function() {
        E.disconnect();
    }
};

TO = {
    cancel: function() {
        clearTimeout(this.timeOutId);
        this.timeOutId = undefined;
    },
    timeOutId: -1
};

changeScreen = function() {
    var me = this;
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            return me.dispatch('lowerSwitchTimes');
        }
        return true;
    });
    window.onblur = function() {
        return me.dispatch('lowerSwitchTimes');
    };
};
