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
                            selectPercent: me.countPercent(attr.name),
                            checked: me.isChecked(attr.name)
                        };
                    });
                },
                countPercent: function(name) {
                    var selectedCount = _.filter(this.data.answerRecords, function(a) {
                            return a && a.answer === name;
                        }).length,
                        p = this.data.answerRecords.length === 0 ? 0 : selectedCount / this.data.answerRecords.length;
                    return Number(p * 100).toFixed(2);
                },
                isChecked: function(name) {
                    var answerRecord = _.find(this.data.answerRecords, [
                        'researchRecordId', this.data.researchRecordId
                    ]);
                    return name === answerRecord.answer;
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
