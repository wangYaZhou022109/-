var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps');

exports.items = {
    // title: 'title',
    main: 'main',
    side: 'side',
    description: ''
};

exports.title = '汇总统计';
exports.large = true;

exports.store = {
    models: {
        summaryDetail: {
            url: '../exam/research-activity/summary-detail',
            mixin: {
                getAnswerRecordsByQuestionId: function(questionId) {
                    var researchAnswerRecordMaps = this.data.researchAnswerRecordMaps;
                    return _.filter(_.map(researchAnswerRecordMaps, function(r) {
                        return _.find(r.researchAnswerRecords, ['questionId', questionId]);
                    }), function(rr) {
                        return rr;
                    });
                },
                getQuestionIndex: function(questionId, dimensionId) {
                    var dimensions = this.data.dimensions,
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
                        summaryDetail = this.module.store.models.summaryDetail;
                    return D.assign(question, {
                        answerRecords: summaryDetail.getAnswerRecordsByQuestionId(question.id),
                        index: summaryDetail.getQuestionIndex(question.id, question.dimensionId)
                    });
                }
            }
        },
        dimensions: {
            mixin: {
                init: function(dimensions) {
                    var questionTypes = maps.get('research-question-types'),
                        chineseNumber = maps.get('chineseNumber'),
                        emptyIndex = -1;

                    if (dimensions) {
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
                                dimensionIndex: dimensionIndex,
                                questions: _.map(d.questions, function(q, n) {
                                    return D.assign(q, {
                                        questionIndex: n + 1,
                                        status: i === 0 && n === 0 ? 'current' : 'init',
                                        typeDesc: _.find(questionTypes, ['key', q.type.toString()]).value + '题'
                                    });
                                })
                            });
                        });
                    }
                },
                selectQuestion: function(questionId) {
                    var index = this.data.findIndex(function(d) {
                        return _.some(d.questions, function(q) {
                            return q.status === 'current';
                        });
                    });

                    D.assign(_.find(this.data[index].questions, ['status', 'current']), {
                        status: 'init'
                    });

                    index = this.data.findIndex(function(d) {
                        if (_.find(d.questions, ['id', questionId])) {
                            return true;
                        }
                        return false;
                    });

                    D.assign(_.find(this.data[index].questions, ['id', questionId]), {
                        status: 'current'
                    });
                    this.changed();
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var summaryDetail = this.models.summaryDetail,
                questions = this.models.questions,
                dimensions = this.models.dimensions;

            summaryDetail.clear();
            dimensions.clear();
            dimensions.changed();

            if (payload.summaryDetail) {
                summaryDetail.set(payload.summaryDetail);
                questions.init(payload.summaryDetail.dimensions);
                dimensions.init(summaryDetail.data.dimensions);
                summaryDetail.changed();
            } else if (payload.researchQuestionaryId) {
                summaryDetail.params = {
                    researchQuestionaryId: payload.researchQuestionaryId,
                    businessId: payload.businessId
                };
                return this.get(summaryDetail).then(function() {
                    questions.init(summaryDetail.data.dimensions);
                    dimensions.init(summaryDetail.data.dimensions);
                    questions.changed();
                    dimensions.changed();
                });
            }
            return '';
        },
        selectQuestion: function(payload) {
            this.models.dimensions.selectQuestion(payload.id);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
