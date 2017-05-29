var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps'),
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    getCurrentStatus;

exports.items = {
    title: 'title',
    main: 'main',
    side: 'side'
};

exports.large = true;

exports.title = '汇总统计';

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
                }
            }
        },
        researchRecord: {
            url: '../exam/research-activity/summary-detail',
            mixin: {
                getAnswerRecordsByQuestionId: function(questionId) {
                    var researchAnswerRecordMaps = this.data.researchQuestionary.researchAnswerRecordMaps;
                    return _.filter(_.map(researchAnswerRecordMaps, function(r) {
                        return _.find(r.researchAnswerRecords, ['questionId', questionId]);
                    }), function(rr) {
                        return rr;
                    });
                },
                getQuestionIndex: function(questionId, dimensionId) {
                    var dimensions = this.data.researchQuestionary.dimensions,
                        index = dimensions.findIndex(function(d) {
                            return d.id === dimensionId;
                        }),
                        questions = dimensions[index].questions,
                        questionIndex = questions.findIndex(function(q) {
                            return q.id === questionId;
                        });
                    return questionIndex + 1;
                }
            }
        },
        questions: {
            mixin: {
                init: function(dimensions) {
                    var me = this;
                    this.data = [];
                    _.forEach(dimensions, function(d) {
                        if (d.questions) {
                            _.forEach(d.questions, function(q) {
                                me.data.push(q);
                            });
                        }
                    });
                },
                getQuestionById: function(id) {
                    var question = _.find(this.data, ['id', id]),
                        researchRecord = this.module.store.models.researchRecord;
                    return D.assign(question, {
                        answerRecords: researchRecord.getAnswerRecordsByQuestionId(question.id),
                        index: researchRecord.getQuestionIndex(question.id, question.dimensionId),
                        researchRecordId: researchRecord.data.id
                    });
                }
            }
        },
        dimensions: {
            mixin: {
                init: function(dimensions) {
                    var questionTypes = maps.get('research-question-types'),
                        chineseNumber = maps.get('chineseNumber'),
                        emptyIndex = dimensions.findIndex(function(d) {
                            return d.isEmpty === 1;
                        }); // 空维度不计入序号

                    this.data = _.map(dimensions, function(d, i) {
                        var dimensionIndex = _.find(chineseNumber, ['key', (i + 1).toString()]).value;
                        if (emptyIndex !== -1 && emptyIndex < i) {
                            dimensionIndex = _.find(chineseNumber, ['key', i.toString()]).value;
                        }
                        if (emptyIndex === i) dimensionIndex = '';
                        return D.assign(d, {
                            isCurrent: true,
                            dimensionIndex: dimensionIndex,
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
        }
    },
    callbacks: {
        init: function(payload) {
            var researchRecord = this.models.researchRecord,
                questions = this.models.questions,
                dimensions = this.models.dimensions,
                state = this.models.state;

            researchRecord.clear();
            if (payload.researchRecord) {
                researchRecord.set(payload.researchRecord);
                questions.init(payload.researchRecord.researchQuestionary.dimensions);
                researchRecord.changed();
            } else if (payload.researchRecordId) {
                researchRecord.params = {
                    researchRecordId: payload.researchRecordId
                };
                return this.get(researchRecord).then(function() {
                    questions.init(dimensions.init(researchRecord.data.researchQuestionary.dimensions));
                    dimensions.changed();
                    state.init();
                });
            }
            return '';
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
        move: function(payload) {
            this.models.dimensions.move(payload);
            this.models.dimensions.changed();
            this.models.state.resetCurrentQuestion();
            this.models.state.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};

getCurrentStatus = function() {
    return itemStatus.INIT;
};
