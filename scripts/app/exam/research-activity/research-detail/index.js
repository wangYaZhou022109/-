var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps'),
    strings = require('./app/util/strings'),
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    getCurrentStatus,
    PC_TYPE = 1;

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
        state: {
            mixin: {
                init: function() {
                    var dimensions = this.module.store.models.dimensions,
                        currentDimension = dimensions.getFirstDimension();
                    this.data = {
                        currentDimension: currentDimension,
                        currentQuestion: currentDimension.questions[0]
                    };
                },
                selectQuestion: function(question) {
                    var dimensions = this.module.store.models.dimensions;
                    D.assign(this.data, {
                        currentQuestion: question,
                        currentDimension: dimensions.getDimension(question.id)
                    });
                },
                resetCurrentQuestion: function() {
                    var dimensions = this.module.store.models.dimensions;
                    D.assign(this.data, { currentQuestion: dimensions.getCurrentQuestion() });
                },
                calculate: function() {
                    var answer = this.module.store.models.answer,
                        questions = this.module.store.models.questions.data || [],
                        answeredCount = answer.answeredCount();
                    D.assign(this.data, {
                        answeredCount: answeredCount,
                        noAnswerCount: questions.length - answeredCount
                    });
                    this.save();
                },
                isComplete: function() {
                    return this.data.noAnswerCount === 0;
                }
            }
        },
        researchRecord: { url: '../exam/research-record/front/research-detail' },
        questions: {
            mixin: {
                init: function(dimensions) {
                    var me = this;
                    this.data = [];
                    _.forEach(dimensions, function(d) {
                        if (d.questions) {
                            _.forEach(d.questions, function(q, n) {
                                me.data.push(D.assign(q, {
                                    index: n + 1
                                }));
                            });
                        }
                    });
                },
                getQuestionById: function(id) {
                    return _.find(this.data, ['id', id]);
                }
            }
        },
        dimensions: {
            mixin: {
                init: function(dimensions) {
                    var questionTypes = maps.get('research-question-types'),
                        chineseNumber = maps.get('chineseNumber');

                    this.data = _.map(dimensions, function(d, i) {
                        return D.assign(d, {
                            isCurrent: true,
                            dimensionIndex: _.find(chineseNumber, ['key', (i + 1).toString()]).value,
                            questions: _.map(d.questions, function(q, n) {
                                return D.assign(q, {
                                    questionIndex: n + 1,
                                    typeDesc: _.find(questionTypes, ['key', q.type.toString()]).value + '题',
                                    status: i === 0 && n === 0 ? itemStatus.CURRENT : itemStatus.INIT
                                });
                            }),
                            questionSize: d.questions.length
                        });
                    });
                    return this.data;
                },
                getDimension: function(questionId) {
                    return _.find(this.data, function(d) {
                        return _.some(d.questions, function(q) {
                            return q.id === questionId;
                        });
                    });
                },
                getQuestionById: function(id) {
                    var question;
                    _.forEach(this.data, function(d) {
                        _.forEach(d.questions, function(q) {
                            if (q.id === id) question = q;
                        });
                    });
                    return question;
                },
                selectDimension: function(id) {
                    if (!this.module.store.models.state.data.selectQuestion) {
                        this.data[id].isCurrent = !this.data[id].isCurrent;
                    }
                    this.module.store.models.state.data.selectQuestion = false;
                },
                selectQuestion: function(questionId) {
                    var dimension = this.getDimension(questionId),
                        index = dimension.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        }),
                        me = this;
                    if (index > -1) {
                        dimension.questions[index].status = getCurrentStatus.call(this, dimension.questions[index].id);
                    }
                    D.assign(this.getQuestionById(questionId), {
                        status: itemStatus.CURRENT
                    });

                     //  把其他类型的题目的current 设置为其他状态
                    _.forEach(_.filter(this.data, function(d) {
                        return _.every(d.questions, function(q) {
                            return q.id !== questionId;
                        });
                    }), function(dd) {
                        var n = dd.questions.findIndex(function(qq) {
                            return qq.status === itemStatus.CURRENT;
                        });
                        if (n !== -1) {
                            D.assign(dd.questions[n], { status: getCurrentStatus.call(me, dd.questions[n].id) });
                        }
                    });
                    this.module.store.models.state.data.selectQuestion = true;
                },
                updateStatus: function(id, status) {
                    D.assign(this.getQuestionById(id), {
                        status: status
                    });
                },
                getFirstDimension: function() {
                    return this.data[0];
                },
                getCurrentQuestion: function() {
                    var question;
                    _.forEach(this.data, function(d) {
                        _.forEach(d.questions, function(q) {
                            if (q.status === itemStatus.CURRENT) {
                                question = q;
                            }
                        });
                    });
                    return question;
                },
                move: function(payload) {
                    var dimension = this.data[payload.id],
                        index = dimension.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        }),
                        question = dimension.questions[index + payload.offset];
                    if (question) {
                        question.status = itemStatus.CURRENT;
                        dimension.questions[index].status = getCurrentStatus.call(this, dimension.questions[index].id);
                    }
                }
            }
        },
        answer: {
            data: [],
            mixin: {
                saveAnswer: function(data) {
                    var temp = _.reject(this.data, ['key', data.key]);
                    temp.push(data);
                    this.data = temp;
                },
                getAnswer: function(id) {
                    if (this.data) {
                        return _.find(this.data, ['key', id]);
                    }
                    return null;
                },
                answeredCount: function() {
                    return _.filter(this.data, function(a) {
                        return a.value[0].value !== '';
                    }).length;
                },
                getData: function() {
                    var me = this;
                    return {
                        researchAnswerRecords: JSON.stringify(_.map(this.data, function(a) {
                            return {
                                questionId: a.key,
                                answer: _.map(a.value, 'value').join(','),
                                score: a.value[0].score,
                                researchRecordId: me.store.models.researchRecord.data.id
                            };
                        }))
                    };
                }
            }
        },
        form: { url: '../exam/research-answer-record/submit' }
    },
    callbacks: {
        init: function(payload) {
            var researchRecord = this.models.researchRecord,
                questions = this.models.questions,
                dimensions = this.models.dimensions,
                state = this.models.state;
            if (payload.researchRecord) {
                researchRecord.set(payload.researchRecord);
            } else if (payload.researchQuestionaryId) {
                researchRecord.params = {
                    researchQuestionaryId: payload.researchQuestionaryId,
                    businessId: payload.businessId,
                    clientType: PC_TYPE
                };
                return this.get(researchRecord).then(function() {
                    questions.init(dimensions.init(researchRecord.data.researchQuestionary.dimensions));
                    state.init();
                    questions.changed();
                });
            }
            return '';
        },
        saveResearchDetail: function() {
            var me = this,
                researchRecord = this.models.researchRecord;

            this.models.form.set(D.assign({}, this.models.answer.getData(), {
                researchQuestionaryId: researchRecord.params.researchQuestionaryId,
                businessId: researchRecord.params.businessId
            }));

            return this.post(this.models.form).then(function() {
                var record = me.models.researchRecord.data;
                me.app.message.success(strings.get('submit-success'));
                me.app.navigate('exam/research-activity/research-answer/' + record.id, true);
            });
        },
        selectDimension: function(payload) {
            this.models.dimensions.selectDimension(payload.id);
            this.models.dimensions.changed();
        },
        selectQuestion: function(payload) {
            this.models.dimensions.selectQuestion(payload.id);
            this.models.dimensions.changed();
            this.models.state.selectQuestion(this.models.dimensions.getQuestionById(payload.id));
        },
        saveAnswer: function(data) {
            this.models.answer.saveAnswer(data);
            this.models.state.calculate();
            this.models.dimensions.updateStatus(data.key, itemStatus.ACTIVE);
            this.models.dimensions.changed();
        },
        move: function(payload) {
            this.models.dimensions.move(payload);
            this.models.dimensions.changed();
            this.models.state.resetCurrentQuestion();
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);// 调研
};

getCurrentStatus = function(id) {
    var answer = this.store.models.answer.data;
    if (_.find(answer, ['key', id])) {
        return itemStatus.ACTIVE;
    }
    return itemStatus.INIT;
};
