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

exports.title = '调研详情';

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
            url: '../exam/research-record/detail',
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
                        chineseNumber = maps.get('chineseNumber');

                    this.data = _.map(dimensions, function(d, i) {
                        return D.assign(d, {
                            isCurrent: true,
                            dimensionIndex: _.find(chineseNumber, ['key', (i + 1).toString()]).value,
                            questions: _.map(d.questions, function(q, n) {
                                return D.assign(q, {
                                    questionIndex: n + 1,
                                    typeDesc: _.find(questionTypes, ['key', q.type.toString()]).value + '题',
                                    status: itemStatus.INIT
                                });
                            })
                        });
                    });
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
                selectQuestion: function(questionId) {
                    var dimension = this.getDimension(questionId),
                        index = dimension.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        });
                    if (index > -1) {
                        dimension.questions[index].status = getCurrentStatus.call(this, dimension.questions[index].id);
                    }
                    D.assign(this.getQuestionById(questionId), {
                        status: itemStatus.CURRENT
                    });
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
                dimensions = this.models.dimensions;

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
                    dimensions.init(researchRecord.data.researchQuestionary.dimensions);
                    questions.init(researchRecord.data.researchQuestionary.dimensions);
                    questions.changed();
                    dimensions.changed();
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
