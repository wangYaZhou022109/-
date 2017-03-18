var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    title: 'title',
    main: 'main',
    side: 'side'
};

exports.large = true;

exports.title = '调研详情';

exports.store = {
    models: {
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
        }
    },
    callbacks: {
        init: function(payload) {
            var researchRecord = this.models.researchRecord,
                questions = this.models.questions;

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
                    questions.init(researchRecord.data.researchQuestionary.dimensions);
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
