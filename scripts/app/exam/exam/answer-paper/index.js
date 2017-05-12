var options = require('./app/exam/exam/base-paper/index'),
    D = require('drizzlejs'),
    helper = require('./answer-helper'),
    _ = require('lodash/collection'),
    $ = require('jquery'),
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
    viewAnswerDetail;

var setOptions = {
    items: {
        'count-down': 'count-down',
        'answer-detail': 'answer-detail'
    },
    store: {
        models: {
            exam: {
                type: 'localStorage',
                url: '../exam/exam/exam-paper',
                mixin: {
                    decryptAnswer: function() {
                        var key = this.module.store.models.decryptKey.data.key;
                        D.assign(this.data, {
                            encryptContent: helper.decryptAnswer.call(this, this.data.paper.encryptContent, key)
                        });
                        return this.data.encryptContent;
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
                        this.data = {};
                        this.save();
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
                                    return sub.value.length === 0
                                        || _.every(sub.value, function(sv) {
                                            return !sv.value;
                                        });
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
            },
            examRecord: {
                url: '../exam/exam-record/cache'
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
                    me = this;

                exam.load();
                _.forEach(me.models, function(m) {
                    m.clear();
                });
                D.assign(examRecord.params, { examId: payload.examId });
                // 先请求一次考试记录判断是否重置
                return this.get(examRecord).then(function() {
                    if (!exam.data
                        || (exam.data && exam.data.id !== payload.examId)
                        || (examRecord.data.isReset && examRecord.data.isReset === 1)) {
                        _.forEach(me.models, function(m) {
                            m.clear();
                        });

                        D.assign(exam.params, { examId: payload.examId });
                        return me.get(exam).then(function() {
                            exam.save();
                            answer.init(exam.data.paper.answerRecords);
                            types.init(exam.data.paper.questions);
                            state.init(exam.data);
                            countDown.init();
                            mark.init();
                        });
                    }
                    return '';
                });
            },
            saveAnswer: function(payload) {
                this.models.answer.saveAnswer(payload);
                this.models.modify.saveAnswer(payload);
                this.models.state.calculate();
                if (this.models.state.data.singleMode) {
                    this.models.state.changed();
                } else {
                    this.models.types.updateStatus(payload.key, itemStatus.ACTIVE);
                    this.models.state.changed();
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
                    examRecordId = this.module.store.models.exam.data.examRecord.id,
                    data = {
                        examRecordId: examRecordId,
                        submitType: payload.submitType,
                        answerRecords: this.models.modify.changeAnswerRecord(),
                        clientType: constant.PC_CLIENT_TYPE
                    };

                if (payload.submitType !== submitType.Auto) {
                    helper.TO.cancel();
                }

                this.models.form.set(data);
                if (f) {
                    return this.post(this.models.form).then(function() {
                        if (payload.submitType === submitType.Auto) {
                            me.models.modify.clear();
                        } else {
                            helper.WS.closeConnect();
                            viewAnswerDetail.call(me);
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
                var exam = this.models.exam.data,
                    message;
                if (exam.allowSwitchTimes) {
                    if (exam.allowSwitchTimes === exam.lowerSwitchTimes + 1) {
                        this.app.message.error(strings.get('exam.answer-paper.switch-screen.full-times'));
                        return this.module.dispatch('submitPaper', { submitType: submitType.Hand }).then(function() {
                            helper.WS.closeConnect();
                        });
                    }

                    D.assign(exam, { lowerSwitchTimes: (exam.lowerSwitchTimes || 0) + 1 });
                    this.models.exam.save();

                    message = strings.getWithParams(
                        'exam.answer-paper.switch-screen.remain-times',
                        exam.allowSwitchTimes - exam.lowerSwitchTimes
                    );

                    this.app.message.success(message);
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
        return this.dispatch('init', this.renderOptions);
    },
    afterRender: function() {
        var me = this,
            firstTime = 1,
            examId = this.store.models.exam.data.id,
            getRandom = function() {
                var r = Math.random() * 1,
                    min = Number(r.toFixed(2)),
                    ms = (min + 1) * (1000 * 60);
                return ms;
            },
            f = true,
            autoSubmit = function(time) {
                if (!me.store.models.exam.data.id) return '';
                if (time !== 1) {
                    me.app.message.success(strings.get('exam.answer-paper.auto-submit-success'));
                }
                return me.dispatch('submitPaper', { submitType: submitType.Auto }).then(function() {
                    helper.TO.timeOutId = setTimeout(autoSubmit, getRandom());
                });
            };

        if (f) {
            autoSubmit(firstTime);

            helper.TO.timeOutId = setTimeout(autoSubmit, getRandom());

            helper.WS.connect(examId, function() {
                return me.dispatch('submitPaper', { submitType: submitType.Hand }).then(function() {
                    helper.WS.closeConnect();
                    return me.dispatch('showTips', {
                        tips: strings.get('exam.answer-paper.force-submit')
                    });
                });
            }, function(delay) {
                return me.dispatch('delay', { delay: Number(delay) });
            });
        }
        helper.switchScreen.call(this, this.store.models.exam.data);
        helper.closeListener.call(this, strings.get('exam.answer-paper.close-window'));
    },
    getCurrentStatus: function(id) {
        var answer = this.store.models.answer.data,
            waitingChecks = this.store.models.mark.data.waitingChecks;
        if (_.find(waitingChecks, ['key', id])) {
            return itemStatus.CHECK;
        }
        if (_.find(answer, ['key', id])) {
            return itemStatus.ACTIVE;
        }
        return itemStatus.INIT;
    }
});

module.exports = target;

viewAnswerDetail = function() {
    var exam = this.models.exam.data,
        me = this;
    if (exam.isShowAnswerImmed === constant.SHOW_ANSWER_IMMED) {
        $('.achievement-content').html('');
        $('.achievement-content').hide();

        me.module.dispatch('showAnswerDetail');
    }
};
