
exports.items = {
    main: 'main',
    'train/programme/question/types/research-detail-summary/summary/more': { isModule: true }
};

exports.store = {
    models: {
        question: {
            mixin: {
                init: function() {
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.question.set(payload.question);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
