var _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        question: {
            mixin: {
                init: function() {
                    this.data.options = _.map(this.data.questionAttrs, function(attr, i) {
                        return {
                            code: String.fromCharCode(i + 'A'.charCodeAt(0)),
                            text: attr.value
                        };
                    });
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
