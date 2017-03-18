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
    getCurrentStatus;

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
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
                            isCurrent: false,
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
                getData: function() {
                    var me = this;
                    return {
                        researchAnswerRecords: JSON.stringify(_.map(this.data, function(a) {
                            return {
                                questionId: a.key,
                                answer: _.map(a.value, 'value').join(','),
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
                dimensions = this.models.dimensions;

            if (payload.researchRecord) {
                researchRecord.set(payload.researchRecord);
            } else if (payload.researchQuestionaryId) {
                researchRecord.params = { researchQuestionaryId: payload.researchQuestionaryId };
                return this.get(researchRecord).then(function() {
                    dimensions.init(researchRecord.data.researchQuestionary.dimensions);
                    questions.init(researchRecord.data.researchQuestionary.dimensions);
                    questions.changed();
                });
            }
            return '';
        },
        saveResearchDetail: function() {
            var me = this;
            this.models.form.set(this.models.answer.getData());
            return this.post(this.models.form).then(function() {
                me.app.message.success(strings.get('submit-success'));
                setTimeout(function() {
                    window.close();
                }, 500);
            });
        },
        move: function(payload) {
            this.models.dimensions.move(payload);
            this.models.dimensions.changed();
        },
        selectDimension: function(payload) {
            this.models.dimensions.selectDimension(payload.id);
            this.models.dimensions.changed();
        },
        selectQuestion: function(payload) {
            this.models.dimensions.selectQuestion(payload.id);
            this.models.dimensions.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

getCurrentStatus = function(id) {
    var answer = this.store.models.answer.data;
    if (_.find(answer, ['key', id])) {
        return itemStatus.ACTIVE;
    }
    return itemStatus.INIT;
};
