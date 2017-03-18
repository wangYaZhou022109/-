
exports.items = {
    main: 'main',
    'exam/question/types/research-detail-summary/question-answer/more': { isModule: true }
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
