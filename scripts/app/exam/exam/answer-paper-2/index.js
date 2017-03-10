var $ = require('jquery'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    E = require('./app/exam/exam-websocket'),
    maps = require('./app/util/maps'),
    qTypes = maps.get('question-types'),
    strings = require('./app/util/strings'),
    changeToFullScreen,
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
    submitType = {
        Auto: 'Auto',
        Hand: 'Hand'
    },
    connect,
    closeConnect,
    cancel,
    timeOutId;

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head',
    'count-down': 'count-down'
};

exports.store = {
    models: {
        exam: {
            type: 'localStorage',
            url: '../exam/exam/exam-paper'
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
                        type.questions[index].status = getCurrentStatus.call(this, id);
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
                        type.questions[index].status = getCurrentStatus.call(this, type.questions[index].id);
                    }
                }
            }
        },
        mark: {
            type: 'localStorage',
            mixin: {
                init: function() {
                    this.load();
                    if (!this.data) this.data = { corrects: [], waitingChecks: [] };
                },
                isCorrectView: function(id) {
                    return id.indexOf('correct-') > -1;
                },
                getCorrect: function(questionId) {
                    return _.find(this.data.corrects, ['key', questionId]);
                },
                waitingCheck: function(id) {
                    this.data.waitingChecks = _.reject(this.data.waitingChecks, ['key', id]);
                    this.data.waitingChecks.push({ key: id });
                    this.save();
                }
            }
        },
        countDown: {
            type: 'localStorage',
            mixin: {
                init: function() {
                    this.data = {};
                    this.save();
                }
            }
        },
        answer: {
            type: 'localStorage',
            mixin: {
                init: function() {
                    this.load();
                    if (!this.data) this.data = [];
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
        },
        modify: {
            type: 'localStorage',
            mixin: {
                saveAnswer: function(data) {
                    if (!this.data) this.data = [];
                    this.data = _.reject(this.data, ['key', data.key]);
                    this.data.push(data);
                    this.save();
                },
                changeAnswerRecord: function() {
                    var results = [];
                    _.forEach(this.data.answers, function(a) {
                        if (a.type && a.type === 6) {
                            _.forEach(a.value, function(v) {
                                results.push(v);
                            });
                        } else {
                            results.push(a);
                        }
                    });
                    return JSON.stringify(_.map(results, function(a) {
                        return {
                            questionId: a.key,
                            answer: _.map(a.value, 'value').join(',')
                        };
                    }));
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
                state = this.models.state,
                countDown = this.models.countDown,
                mark = this.models.mark,
                answer = this.models.answer;

            exam.load();
            if (!exam.data) {
                D.assign(exam.params, { examId: payload.examId });
                return this.get(exam).then(function() {
                    exam.save();
                    types.init(exam.data.paper.questions);
                    state.init(exam.data);
                    countDown.init();
                    mark.init();
                    answer.init();
                });
            }
            types.init(exam.data.paper.questions);
            state.init(exam.data);
            countDown.init();
            mark.init();
            answer.init();
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

            if (payload.submitType !== submitType.Auto) cancel();

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
        delay: function(payload) {
            this.models.countDown.data.delay = payload.delay;
            this.models.countDown.changed();
        }
    }
};

exports.beforeRender = function() {
    changeToFullScreen();
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
        random = getRandom(),
        autoSubmit = function() {
            return me.dispatch('submitPaper', { submitType: submitType.Auto }).then(function() {
                timeOutId = setTimeout(autoSubmit, random);
            });
        };

    autoSubmit();

    timeOutId = setTimeout(autoSubmit, random);

    connect(examId, function() {
        me.app.message.error('你本次考试已被管理员强制交卷');
        return me.dispatch('submit', { submitType: submitType.Hand }).then(function() {
            closeConnect();
        });
    }, function(delay) {
        return me.dispatch('delay', { delay: Number(delay) });
    });
};

connect = function(examId, submitPaper, timeExpand) {
    E.connect(examId, {
        submitPaper: submitPaper,
        timeExpand: timeExpand
    });
};

closeConnect = function() {
    E.disconnect();
};

cancel = function() {
    clearTimeout(timeOutId);
    timeOutId = undefined;
};

changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};

getCurrentStatus = function(id) {
    var answer = this.store.models.answer.data,
        waitingChecks = this.store.models.mark.data.waitingChecks;
    if (_.find(waitingChecks, ['key', id])) {
        return itemStatus.CHECK;
    }
    if (_.find(answer, ['key', id])) {
        return itemStatus.ACTIVE;
    }
    return itemStatus.INIT;
};
