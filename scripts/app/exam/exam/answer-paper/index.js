var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    E = require('./app/exam/exam-websocket'),
    $ = require('jquery'),
    CryptoJS = require('crypto-js'),
    maps = require('./app/util/maps'),
    qTypes = maps.get('question-types'),
    getCurrentStatus,
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
    },
    submitType = {
        Auto: 'Auto',
        Hand: 'Hand'
    },
    WS,
    TO,
    switchScreen,
    viewAnswerDetail,
    SINGLE_CHOOSE = 1,
    MUTIPLE_CHOOSE = 2,
    JUDGEMENT = 3,
    SENTENCE = 4,
    QUESTION_ANSWER = 5,
    READING = 6,
    SORTING = 8,
    decryptAnswer,
    IV = '1234567890123456';

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head',
    'count-down': 'count-down',
    'answer-detail': 'answer-detail'
};

exports.store = {
    models: {
        exam: {
            type: 'localStorage',
            url: '../exam/exam/exam-paper',
            mixin: {
                decryptAnswer: function() {
                    D.assign(this.data, {
                        encryptContent: decryptAnswer.call(this, this.data.paper.encryptContent)
                    });
                    return this.data.encryptContent;
                }
            }
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
                    this.save();
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
                        this.sortQuestion();
                        this.save();
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
                    if (!this.module.store.models.state.data.selectQuestion) {
                        this.data[id].isCurrent = !this.data[id].isCurrent;
                    }
                    this.module.store.models.state.data.selectQuestion = false;
                    this.save();
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
                        type.questions[index].status = getCurrentStatus.call(this, type.questions[index].id);
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
                    this.save();
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
                    this.save();
                },
                decryptAnswer: function(answers) {
                    var afterDecryptQuestion = function(q, answer) {
                        if (q.type === SINGLE_CHOOSE || q.type === MUTIPLE_CHOOSE) {
                            return D.assign(q, {
                                questionAttrCopys: _.map(q.questionAttrCopys, function(attr) {
                                    if (_.find(answer.answer, ['value', attr.name])) {
                                        return D.assign(attr, { type: 0 });
                                    }
                                    return D.assign(attr, { type: q.type });
                                })
                            });
                        }

                        if (q.type === JUDGEMENT || q.type === SENTENCE || q.type === QUESTION_ANSWER) {
                            return D.assign(q, {
                                questionAttrCopys: _.map(q.questionAttrCopys, function(attr) {
                                    return D.assign(attr, {
                                        name: answer.answer,
                                        value: answer.answer
                                    });
                                })
                            });
                        }

                        if (q.type === SORTING) {
                            return D.assign(q, {
                                questionAttrCopys: _.map(q.questionAttrCopys, function(attr) {
                                    if (attr.type === 0) {
                                        return D.assign(attr, { name: answer.answer });
                                    }
                                    return attr;
                                })
                            });
                        }
                        return q;
                    };
                    this.data = _.map(this.data, function(t) {
                        return D.assign(t, {
                            questions: _.map(t.questions, function(q) {
                                var a = _.find(answers, ['questionId', q.id]);
                                if (q.type === READING) {
                                    return D.assign(q, {
                                        subs: _.map(q.subs, function(s) {
                                            return afterDecryptQuestion(s, a);
                                        })
                                    });
                                }
                                return afterDecryptQuestion(q, a);
                            })
                        });
                    });
                },
                updateStatus: function(questionId, status) {
                    D.assign(this.getQuestionById(questionId), {
                        status: status
                    });
                    this.save();
                }
            }
        },
        mark: {
            type: 'localStorage',
            mixin: {
                init: function() {
                    this.data = { corrects: [], waitingChecks: [] };
                    this.save();
                },
                isCorrectView: function(id) {
                    return id.indexOf('correct-') > -1;
                },
                getCorrect: function(questionId) {
                    return _.find(this.data.corrects, ['key', questionId]);
                },
                waitingCheck: function(id) {
                    var f = false;
                    if (_.find(this.data.waitingChecks, ['key', id])) {
                        this.data.waitingChecks = _.reject(this.data.waitingChecks, ['key', id]);
                    } else {
                        this.data.waitingChecks.push({ key: id });
                        f = true;
                    }
                    this.save();
                    return f;
                },
                correct: function(data) {
                    this.data.corrects = _.reject(this.data.corrects, ['questionId', data.questionId]);
                    this.data.corrects.push(data);
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
                    _.forEach(this.data, function(a) {
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
        },
        decryptKey: {
            url: '../exam/exam/decrypt-key'
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
            if (!exam.data || (exam.data && exam.data.id !== payload.examId)) {
                _.forEach(this.models, function(m) {
                    m.clear();
                });

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
            if (this.models.state.data.singleMode) {
                this.models.state.changed();
            } else {
                this.models.types.updateStatus(payload.key, itemStatus.ACTIVE);
                this.models.types.changed();
            }
        },
        waitingCheck: function(payload) {
            var f = this.models.mark.waitingCheck(payload.questionId);
            if (!this.models.state.singleMode) {
                if (f) {
                    this.models.types.updateStatus(payload.questionId, itemStatus.CHECK);
                } else {
                    this.models.types.updateStatus(
                        payload.questionId,
                        getCurrentStatus.call(this.module, payload.questionId)
                    );
                }
                this.models.types.changed();
            }
        },
        correct: function(payload) {
            this.models.mark.correct(payload);
        },
        submitPaper: function(payload) {
            var me = this,
                f = true,
                examRecordId = this.module.store.models.exam.data.examRecord.id,
                data = {
                    examRecordId: examRecordId,
                    submitType: payload.submitType,
                    answerRecords: this.models.modify.changeAnswerRecord(),
                    clientType: constant.PC_CLIENT_TYPE
                };

            if (payload.submitType !== submitType.Auto) {
                TO.cancel();
            }

            this.models.form.set(data);
            if (f) {
                return this.post(this.models.form).then(function() {
                    if (payload.submitType === submitType.Auto) {
                        this.app.message.success('答案已自动保存成功');
                        me.models.modify.clear();
                    } else {
                        viewAnswerDetail.call(me);
                        this.app.message.success('交卷成功');
                    }
                });
            }
            return '';
        },
        delay: function(payload) {
            this.models.countDown.data.delay = payload.delay;
            this.models.countDown.changed();
        },
        lowerSwitchTimes: function() {
            var exam = this.models.exam.data;
            if (exam.allowSwitchTimes) {
                if (exam.allowSwitchTimes === exam.lowerSwitchTimes + 1) {
                    this.app.message.error('切屏次数已满，强制交卷');
                    return this.module.dispatch('submitPaper', { submitType: submitType.Hand }).then(function() {
                        WS.closeConnect();
                    });
                }
                D.assign(exam, {
                    lowerSwitchTimes: (exam.lowerSwitchTimes || 0) + 1
                });
                this.models.exam.save();
                this.app.message.success('还剩余' + (exam.allowSwitchTimes - exam.lowerSwitchTimes) + '次切屏');
            }
            return true;
        },
        showAnswerDetail: function() {
            var me = this;
            D.assign(this.models.decryptKey.params, {
                examId: this.models.exam.data.id
            });
            return this.get(this.models.decryptKey).then(function() {
                me.models.types.decryptAnswer(JSON.parse(me.models.exam.decryptAnswer()));
                me.models.state.data.showAnswerDetail = 1;
                me.models.state.changed();
            });
        },
        clearModels: function() {
            _.forEach(this.models, function(m) {
                m.clear();
            });
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
    switchScreen.call(this);
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

switchScreen = function() {
    var me = this,
        isAllowSwitch = this.store.models.exam.data.isAllowSwitch;
    if (isAllowSwitch && isAllowSwitch === 1) {
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                return me.dispatch('lowerSwitchTimes');
            }
            return true;
        });
        window.onblur = function() {
            return me.dispatch('lowerSwitchTimes');
        };
    }
};

viewAnswerDetail = function() {
    var exam = this.models.exam.data,
        me = this;
    if (exam.isShowAnswerImmed === constant.SHOW_ANSWER_IMMED) {
        this.app.message.confirm('提交成功，是否马上查看详情', function() {
            $('.achievement-content').html('');
            $('.achievement-content').hide();
            return me.module.dispatch('showAnswerDetail');
        }, function() {
            _.forEach(me.models, function(m) {
                m.clear();
            });
            window.close();
            return false;
        });
    }
    return '';
};

decryptAnswer = function(v) {
    var k = this.store.models.decryptKey.data.key,
        hex = CryptoJS.enc.Hex.parse(v),
        base64Str = CryptoJS.enc.Base64.stringify(hex),
        decrypted = CryptoJS.AES.decrypt(base64Str, CryptoJS.enc.Utf8.parse(k), {
            iv: CryptoJS.enc.Utf8.parse(IV),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }),
        value = CryptoJS.enc.Utf8.stringify(decrypted).toString();
    return value;
};
