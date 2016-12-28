exports.items = {
    top: 'top',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        exam: {
            url: '../exam/exam'
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.exam.set(payload);
            this.get(this.models.exam);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
