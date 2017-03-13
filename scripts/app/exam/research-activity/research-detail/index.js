var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    strings = require('./app/util/strings');

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
        answer: {
            data: { answers: [] },
            mixin: {
                saveAnswer: function(data) {
                    var temp = _.reject(this.data.answers, ['key', data.key]);
                    temp.push(data);
                    this.data.answers = temp;
                },
                getAnswer: function(id) {
                    if (this.data) {
                        return _.find(this.data.answers, ['key', id]);
                    }
                    return null;
                },
                getData: function() {
                    var me = this;
                    return {
                        researchAnswerRecords: JSON.stringify(_.map(this.data.answers, function(a) {
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
                questions = this.models.questions;
            if (payload.researchRecord) {
                researchRecord.set(payload.researchRecord);
            } else if (payload.researchQuestionaryId) {
                researchRecord.params = { researchQuestionaryId: payload.researchQuestionaryId };
                return this.get(researchRecord).then(function() {
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
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
