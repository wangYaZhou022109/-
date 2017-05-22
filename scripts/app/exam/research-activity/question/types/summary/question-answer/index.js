
exports.items = {
    main: 'main',
    'exam/research-activity/question/types/summary/question-answer/more': { isModule: true }
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
