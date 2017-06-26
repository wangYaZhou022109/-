var options = require('./app/exam/exam/base-paper/index'),
    D = require('drizzlejs'),
    helper = require('./answer-helper'),
    _ = require('lodash/collection'),
    strings = require('./app/util/strings'),
    constant = {
        PC_CLIENT_TYPE: 1,
        SHOW_ANSWER_IMMED: 1
    },
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    submitType = {
        Auto: 'Auto',
        Hand: 'Hand'
    },
    submitTipsType = {
        AUTO: 1, //  自动提交
        HAND: 2, //  手动点击提交
        TIMEOUT: 3, //  超时提交
        FORCE: 4, //  强制交卷
        FULL_SWICH: 5 //  切屏满
    },
    showTips,
    showMessage;

var setOptions = {
    items: {
        'count-down': 'count-down',
        'answer-detail': 'answer-detail'
    },
    store: {
        models: {
            exam: {
                type: 'localStorage',
                url: '../exam/exam/front/exam-paper',
                mixin: {
                    decryptAnswer: function() {
                        var key = this.module.store.models.decryptKey.data.key;
                        D.assign(this.data, {
                            encryptContent: helper.decryptAnswer.call(this, this.data.paper.encryptContent, key)
                        });
                        return this.data.encryptContent;
                    },
                    saveLastCacheTime: function(lastCacheTime) {
                        D.assign(this.data, {
                            lastCacheTime: lastCacheTime
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
                    },
                    getWaitingCheck: function(questionId) {
                        return _.find(this.data.waitingChecks, ['key', questionId]);
                    },
                    hasWatingCheck: function() {
                        return this.data.waitingChecks.length > 0;
                    }
                }
            },
            countDown: {
                type: 'localStorage',
                mixin: {
                    init: function() {
                        this.load();
                        if (!this.data) {
                            this.data = {};
                            this.save();
                        }
                    }
                }
            },
            answer: {
                type: 'localStorage',
                mixin: {
                    init: function(answers) {
                        var exam = this.module.store.models.exam.data,
                            temp,
                            readingAnswer;

                        if (answers) {
                            temp = _.map(answers, function(a) {
                                if (a.questionCopy.type === 1 || a.questionCopy.type === 2) {
                                    return {
                                        key: a.questionId,
                                        value: _.map(a.answer.split(','), function(v) {
                                            return { id: a.questionId, value: v };
                                        })
                                    };
                                }
                                return {
                                    key: a.questionId,
                                    value: [{ id: a.questionId, value: a.answer }]
                                };
                            });

                            readingAnswer = _.map(_.filter(exam.paper.questions, function(q) {
                                return q.type === 6;
                            }), function(reading) {
                                return {
                                    key: reading.id,
                                    type: 6,
                                    value: _.map(reading.subs, function(sub) {
                                        var answer = _.find(temp, ['key', sub.id]);
                                        if (answer) {
                                            temp = _.reject(temp, ['key', sub.id]);
                                            return answer;
                                        }
                                        return { key: sub.id, value: [] };
                                    })
                                };
                            });

                            _.forEach(readingAnswer, function(ra) {
                                var flag = _.some(ra.value, function(sub) {
                                    return sub.value.length > 0 && _.every(sub.value, function(sv) {
                                        return sv.value;
                                    });
                                });
                                if (flag) temp.push(ra);
                            });

                            this.data = temp;
                            this.save();
                        } else {
                            this.data = [];
                            this.save();
                        }
                    },
                    saveAnswer: function(data) {
                        this.data = _.reject(this.data, ['key', data.key]);
                        this.data.push(data);
                        this.save();
                    },
                    answeredCount: function() {
                        return _.filter(this.data, function(a) {
                            var readingQuetion = !_.every(a.value, function(sub) {
                                    return D.isArray(sub.value) && (sub.value.length === 0
                                        || _.every(sub.value, function(sv) {
                                            return !sv.value;
                                        }));
                                }),
                                otherQuestion = (a.value.length > 0 && _.some(a.value, function(v) {
                                    return v.value !== '';
                                }));
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
                url: '../exam/exam-record/front/submitPaper'
            },
            decryptKey: {
                url: '../exam/exam/decrypt-key'
            },
            examRecord: {
                type: 'localStorage',
                url: '../exam/exam/exam-record-cache'
            },
            answerRecord: {
                url: '../exam/exam/front/answer-record'
            }
        },
        callbacks: {
            init: function(payload) {
                var exam = this.models.exam,
                    types = this.models.types,
                    state = this.models.state,
                    countDown = this.models.countDown,
                    mark = this.models.mark,
                    answer = this.models.answer,
                    examRecord = this.models.examRecord,
                    me = this,
                    needLoadService = function(exam0, state0, examRecord0) {
                        //  不存在缓存
                        if (!exam0) return true;

                        //  相同用户
                        if (exam0 && examRecord0 && exam0.examRecord.member.id === examRecord0.member.id) {
                            //  不同考试
                            if (exam0.id !== payload.examId) return true;

                            //  最后保存时间不同
                            if (exam0.lastCacheTime
                                && examRecord0
                                && exam0.lastCacheTime !== examRecord0.lastCacheTime) {
                                return true;
                            }

                            //  A浏览器没自动存DB ，B浏览器自动存DB ，取B浏览器
                            if (!exam0.lastCacheTime && examRecord0.lastCacheTime) {
                                return true;
                            }

                            // 考试记录不同
                            if (exam0.examRecord.id !== examRecord0.id) {
                                return true;
                            }

                            //  是否重置
                            if (examRecord0 && examRecord0.isReset === 1) return true;
                        //  不同用户
                        } else {
                            return true;
                        }

                        return false;
                    };

                exam.load();
                state.load();
                D.assign(examRecord.params, { examId: payload.examId });
                // 先请求一次考试记录判断是否重置
                examRecord.clear();
                return this.get(examRecord).then(function() {
                    if (needLoadService(exam.data, state.data, examRecord.data)) {
                        me.module.dispatch('clearModels');
                        D.assign(exam.params, { examId: payload.examId });
                        return me.get(exam).then(function() {
                            exam.save();
                            answer.init(exam.data.paper.answerRecords);
                            mark.init();
                            types.init(exam.data.paper.questions);
                            state.init(exam.data);
                            countDown.init();
                        });
                    }
                    return '';
                });
            },
            init2: function(payload) {
                var exam = this.models.exam,
                    types = this.models.types,
                    state = this.models.state,
                    countDown = this.models.countDown,
                    mark = this.models.mark,
                    answer = this.models.answer,
                    me = this,
                    needChange = function(state0, data) {
                        //  没有缓存
                        if (!state0) return true;
                        //  考试纪录不相同
                        if (state0 && state0.examRecordId !== data.id) return true;
                        //  重置
                        if (data.isReset === 1) return true;
                        return false;
                    };
                state.load();
                exam.clear();

                D.assign(exam.params, { examId: payload.examId });
                return me.get(exam, { loading: true }).then(function() {
                    exam.save();
                    if (needChange(state.data, exam.data.examRecord)) {
                        me.module.dispatch('clearMe');
                        answer.clear();
                        mark.init();
                        types.init(exam.data.paper.questions);
                        state.init(exam.data);
                        countDown.init();
                    }
                });
            },
            saveAnswer: function(payload) {
                var types = this.models.types,
                    me = this;
                this.models.answer.saveAnswer(payload);
                this.models.modify.saveAnswer(payload);
                this.models.state.calculate();
                this.models.state.saveLastCacheTime(new Date().getTime());
                if (me.models.state.data.singleMode) {
                    //  是否需要保存答案后移动到下一题
                    if (types.isNeedMoveAfterSave(payload.key)) {
                        // setTimeout(function() {
                        //     me.module.dispatch('move', {
                        //         id: types.getType(payload.key).id,
                        //         offset: 1
                        //     });
                        // }, 300);
                    }
                    this.models.state.changed();
                } else {
                    this.models.types.updateStatus(payload.key, itemStatus.ACTIVE);
                    this.models.state.changed();
                    this.models.types.changed();
                }

                return this.module.dispatch('checkOverTime');
            },
            waitingCheck: function(payload) {
                var f = this.models.mark.waitingCheck(payload.questionId);
                if (!this.models.state.data.singleMode) {
                    if (f) {
                        this.models.types.updateStatus(payload.questionId, itemStatus.CHECK);
                    } else {
                        this.models.types.updateStatus(
                            payload.questionId,
                            this.module.options.getCurrentStatus.call(this.module, payload.questionId)
                        );
                    }
                    this.models.types.changed();
                }
                this.models.state.changed();
            },
            correct: function(payload) {
                this.models.mark.correct(payload);
            },
            submitPaper: function(payload) {
                var me = this,
                    f = true,
                    state = this.models.state,
                    exam = this.models.exam,
                    countDown = this.module.items['count-down'].getEntities(),
                    examRecordId = this.models.exam.data.examRecord.id,
                    lastCacheTime = new Date().getTime(),
                    data = {
                        examRecordId: examRecordId,
                        submitType: payload.submitType,
                        answerRecords: this.models.modify.changeAnswerRecord(),
                        clientType: constant.PC_CLIENT_TYPE,
                        lastCacheTime: lastCacheTime
                    };

                if (payload.submitType !== submitType.Auto) {
                    helper.TO.cancel();
                }

                this.models.form.set(data);
                if (f) {
                    return this.post(this.models.form, {
                        loading: payload.submitType !== submitType.Auto }).then(function() {
                            state.saveLastCacheTime(lastCacheTime);
                            if (payload.submitType === submitType.Auto) {
                                me.models.modify.clear();
                                me.app.message.success(strings.get('exam.answer-paper.auto-submit-success'));
                            } else {
                                helper.refreshParentWindow();
                                D.assign(state.data, { over: true });
                                helper.WS.closeConnect();
                                if (countDown) {
                                    countDown = countDown[0];
                                    countDown.clearIntervalIt();
                                }

                                showTips.call(me, payload.submitTipsType, exam);
                            }
                        }, function() {
                            //  提交异常提示
                            showMessage.call(me);
                        });
                }
                return '';
            },
            delay: function(payload) {
                var endTime,
                    exam = this.models.exam.data,
                    countDown = this.models.countDown;

                D.assign(countDown.data, {
                    delay: payload.delay,
                    isDeday: true
                });

                endTime = new Date(exam.examRecord.endTime);
                endTime.setMinutes(
                    endTime.getMinutes() + payload.delay,
                    endTime.getSeconds(),
                    0
                );

                D.assign(exam, {
                    examRecord: D.assign(exam.examRecord, {
                        endTime: endTime.getTime()
                    })
                });

                this.models.countDown.changed();
            },
            lowerSwitchTimes: function() {
                var exam = this.models.exam.data,
                    me = this,
                    message;
                if (exam.allowSwitchTimes) {
                    if (exam.allowSwitchTimes === (exam.lowerSwitchTimes || 0) + 1) {
                        return this.module.dispatch('submitPaper', {
                            submitType: submitType.Hand, submitTipsType: submitTipsType.FULL_SWICH
                        });
                    }

                    D.assign(exam, { lowerSwitchTimes: (exam.lowerSwitchTimes || 0) + 1 });
                    this.models.exam.save();

                    message = strings.getWithParams(
                        'exam.answer-paper.switch-screen.remain-times',
                        (exam.allowSwitchTimes - exam.lowerSwitchTimes) + '次'
                    );

                    return me.module.dispatch('showTips', {
                        message: message
                    }).then(function() {
                        me.app.viewport.modal(me.module.items['exam-notes']);
                    });
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
            showTips: function(payload) {
                D.assign(this.models.state.data, payload);
                this.models.state.changed();
            },
            clearMe: function() {
                this.models.mark.clear();
                this.models.types.clear();
                this.models.state.clear();
                this.models.countDown.clear();
            },
            saveLastCacheTime: function() {
                this.models.saveLastCacheTime(new Date().getTime());
            },
            loadAnswerRecord: function() {
                var state = this.models.state.data,
                    exam = this.models.exam.data,
                    types = this.models.types,
                    main = this.models.main,
                    answer = this.models.answer,
                    answerRecord = this.models.answerRecord,
                    me = this,
                    needLoad = function(state0, examRecord0) {
                        //  A客户端没有存DB，B客户端存了最新的db数据
                        if (!state0.lastCacheTime && examRecord0.lastCacheTime) return true;

                        if ((state0.lastCacheTime && examRecord0.lastCacheTime
                            && state0.lastCacheTime < examRecord0.lastCacheTime)) {
                            return true;
                        }
                        return false;
                    };
                if (needLoad(state, exam.examRecord)) {
                    D.assign(answerRecord.params, { examId: exam.id });
                    return me.get(answerRecord, { loading: true }).then(function() {
                        answer.init(answerRecord.data);
                        types.clear();
                        types.init(exam.paper.questions, true);
                        me.models.state.init(exam);
                        me.models.state.resetCurrentQuestion();
                        me.models.state.saveLastCacheTime(new Date().getTime());
                        main.changed();
                        types.changed();
                    }).then(function() {
                        return me.module.dispatch('showTips', {
                            message: '您好，发现您的帐号在其他客户端进行答卷，已为你更换最新答题记录.'
                        }).then(function() {
                            me.app.viewport.modal(me.module.items['exam-notes']);
                        });
                    });
                }
                return '';
            },
            resetDelay: function() {
                var countDown = this.models.countDown;
                D.assign(countDown.data, { isDeday: false });
                countDown.save();
            },
            checkOverTime: function() {
                var exam = this.models.exam.data,
                    current = new Date().getTime();
                if (current > exam.examRecord.endTime) {
                    return this.module.dispatch('submitPaper', {
                        submitType: 'Hand', submitTipsType: submitTipsType.TIMEOUT
                    });
                }
                return '';
            }
        }
    }
};

var items = D.assign({}, options.items);
var models = D.assign({}, options.store.models);
var callbacks = D.assign({}, options.store.callbacks);
var target = D.assign({}, {
    items: D.assign(items, setOptions.items),
    store: {
        models: D.assign(models, setOptions.store.models),
        callbacks: D.assign(callbacks, setOptions.store.callbacks)
    },
    beforeRender: function() {
        return this.dispatch('init2', this.renderOptions);
    },
    afterRender: function() {
        var me = this,
            examId = this.store.models.exam.data.id,
            getRandom = function() {
                var r = Math.random() * 1,
                    min = Number(r.toFixed(2)),
                    ms = (min + 1) * (1000 * 60);
                return ms;
            },
            f = true,

            //  自动提交
            autoSubmit = function() {
                if (!me.store.models.exam.data.id) return '';
                return me.dispatch('submitPaper', {
                    submitType: submitType.Auto, submitTipsType: submitTipsType.AUTO
                }).then(function() {
                    var t = getRandom();
                    helper.TO.timeOutId = setTimeout(autoSubmit, t);
                });
            },

            //  后台主动强制交卷回调
            forceSubmitPaper = function() {
                return me.dispatch('submitPaper', {
                    submitType: submitType.Hand,
                    submitTipsType: submitTipsType.FORCE
                }).then(function() {
                    helper.WS.closeConnect();
                });
            };

        if (f) {
            helper.TO.timeOutId = setTimeout(autoSubmit, getRandom());
            helper.WS.connect(examId, forceSubmitPaper, function(time) {
                return me.dispatch('delay', { delay: Number(time) });
            });
        }

        helper.switchScreen.call(this, this.store.models.exam.data);
        helper.closeListener.call(this, strings.get('exam.answer-paper.close-window'));

        return this.dispatch('reloadState').then(function() {
            return me.dispatch('loadAnswerRecord');
        });
    },
    getCurrentStatus: function(id) {
        var answers = this.store.models.answer.data,
            answer, readingQuetion, otherQuestion,
            waitingChecks = this.store.models.mark.data.waitingChecks;

        if (_.find(waitingChecks, ['key', id])) {
            return itemStatus.CHECK;
        }

        answer = _.find(answers, ['key', id]);
        if (answer) {
            readingQuetion = !_.every(answer.value, function(sub) {
                return D.isArray(sub.value) && (sub.value.length === 0
                    || _.every(sub.value, function(sv) {
                        return !sv.value;
                    }));
            });
            otherQuestion = (answer.value.length > 0 && _.some(answer.value, function(v) {
                return v.value !== '';
            }));
            if (readingQuetion || otherQuestion) {
                return itemStatus.ACTIVE;
            }
        }
        return itemStatus.INIT;
    }
});

module.exports = target;

// viewAnswerDetail = function() {
//     var exam = this.models.exam.data,
//         me = this;
//     if (exam.isShowAnswerImmed === constant.SHOW_ANSWER_IMMED) {
//         this.app.message.confirm(strings.get('exam.view-detail-confirm'), function() {
//             $('.achievement-content').html('');
//             $('.achievement-content').hide();
//             return me.module.dispatch('showAnswerDetail');
//         }, function() {
//             return me.module.dispatch('clearModels').then(function() {
//                 window.close();
//             });
//         });
//     }
// };

showTips = function(type, exam) {
    var me = this,
        tips;
    //  手动点击提交提示
    if (type === submitTipsType.HAND) {
        tips = exam.data.paper.isSubjective === 1
                ? strings.get('exam.answer-paper.submit-success-mark')
                    : strings.get('exam.answer-paper.submit-success');
    }
    //  强制交卷提示
    if (type === submitTipsType.FORCE) {
        tips = strings.get('exam.answer-paper.force-submit');
    }
    //  超时提示
    if (type === submitTipsType.TIMEOUT) {
        tips = strings.get('exam.answer-paper.time-out.submit');
    }
    //  切屏满强制交卷
    if (type === submitTipsType.FULL_SWICH) {
        tips = strings.get('exam.answer-paper.switch-screen.full-times');
    }
    return me.module.dispatch('showTips', {
        tips: tips
    }).then(function() {
        me.app.viewport.modal(me.module.items['exam-notes']);
    });
};

showMessage = function() {
    var me = this;
    this.models.state.data = {};
    return me.module.dispatch('showTips', {
        message: '网络已断开，无法继续考试，请检查本地网络'
    }).then(function() {
        me.app.viewport.modal(me.module.items['exam-notes']);
    });
};
