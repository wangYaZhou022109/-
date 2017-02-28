exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
