var _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        question: {
            mixin: {
                init: function() {
                    var me = this;
                    this.data.options = _.map(this.data.questionAttrs, function(attr, i) {
                        return {
                            code: String.fromCharCode(i + 'A'.charCodeAt(0)),
                            text: attr.value,
                            checked: me.isChecked(attr.name)
                        };
                    });
                },
                isChecked: function(name) {
                    var answerRecord = _.find(this.data.answerRecords, [
                        'researchRecordId', this.data.researchRecordId
                    ]);
                    return answerRecord && answerRecord.answer.indexOf(name) > -1;
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
