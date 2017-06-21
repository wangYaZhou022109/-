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
                            if (a && a.answer) {
                                return _.some(a.answer.split(','), function(as) {
                                    return as === name;
                                });
                            }
                            return false;
                        }).length,
                        effectiveCount = _.filter(this.data.answerRecords, function(a) {
                            if (a && a.answer) return true;
                            return false;
                        }).length, // 有效答题人数
                        p = effectiveCount === 0 ? 0 : selectedCount / effectiveCount,
                        percent = (p * 100) + '';
                    return {
                        selectPercent: percent.indexOf('.') > 0 ? Number(percent).toFixed(2) : percent,
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
