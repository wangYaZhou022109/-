exports.items = {
    main: 'main',
    'ask/article': { isModule: true }
};


exports.store = {
    models: {
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
