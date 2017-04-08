exports.items = {
    main: 'main'
};

exports.large = true;

exports.store = {
    models: {
        question: {}
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
