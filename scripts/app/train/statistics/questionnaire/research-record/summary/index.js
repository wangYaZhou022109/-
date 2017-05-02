var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    title: 'title',
    main: 'main',
    side: 'side'
};

exports.title = '汇总统计';

exports.store = {
    models: {
        summaryDetail: {
            url: '../train/questionnaire-survey/summary-detail',
            mixin: {
                getAnswerRecordsByQuestionId: function(questionId) {
                    var researchAnswerRecordMaps = this.data.researchAnswerRecordMaps;
                    return _.map(researchAnswerRecordMaps, function(r) {
                        return _.find(r.researchAnswerRecords, ['questionId', questionId]);
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
        }
    },
    callbacks: {
        init: function(payload) {
            var summaryDetail = this.models.summaryDetail,
                questions = this.models.questions;
            summaryDetail.clear();

            if (payload.summaryDetail) {
                summaryDetail.set(payload.summaryDetail);
                questions.init(payload.summaryDetail.dimensions);
                summaryDetail.changed();
            } else if (payload.researchQuestionaryId) {
                summaryDetail.params = {
                    researchQuestionaryId: payload.researchQuestionaryId
                };
                return this.get(summaryDetail).then(function() {
                    questions.init(summaryDetail.data.dimensions);
                    questions.changed();
                });
            }
            return '';
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
