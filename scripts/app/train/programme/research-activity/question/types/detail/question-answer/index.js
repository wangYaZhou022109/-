var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        question: {
            mixin: {
                init: function() {
                    this.data = D.assign(this.data, {
                        answerRecord: this.findOwnAnswerRecord()
                    });
                },
                findOwnAnswerRecord: function() {
                    return _.find(this.data.answerRecords, [
                        'researchRecordId', this.data.researchRecordId
                    ]);
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.question.set(payload.question);
            this.models.question.init();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
