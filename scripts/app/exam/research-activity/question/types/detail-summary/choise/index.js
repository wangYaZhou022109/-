var _ = require('lodash/collection'),
    D = require('drizzlejs');

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
                        return D.assign({
                            code: String.fromCharCode(i + 'A'.charCodeAt(0)),
                            text: attr.value,
                        }, me.getSelectData(attr.name));
                    });
                    this.data.answerCount = this.data.answerRecords.length;
                },
                getSelectData: function(name) {
                    var selectedCount = _.filter(this.data.answerRecords, function(a) {
                            return a.answer === name;
                        }).length,
                        p = selectedCount / this.data.answerRecords.length;
                    return {
                        selectPercent: p * 100,
                        selectCount: selectedCount
                    };
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
