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
                            if (a && a.answer) {
                                return _.some(a.answer.split(','), function(as) {
                                    return as === name;
                                });
                            }
                            return false;
                        }).length,
                        p = this.data.answerRecords.length !== 0
                            ? (selectedCount / this.data.answerRecords.length) : 0;
                    return Number(p * 100).toFixed(2);
                },
                isChecked: function(name) {
                    var answerRecord = _.find(this.data.answerRecords, [
                            'researchRecordId', this.data.researchRecordId
                        ]),
                        isChecked = false,
                        answer = [];
                    if (answerRecord && answerRecord.answer) {
                        answer = answerRecord.answer.split(',');
                        isChecked = _.some(answer, function(a) {
                            return a === name;
                        });
                    }
                    return isChecked;
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
