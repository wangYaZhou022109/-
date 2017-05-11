exports.items = {
    main: 'main',
    'ask/question': { isModule: true },
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
    this.options.store.callbacks.leftrefresh = this.renderOptions.leftrefresh;
    this.options.store.callbacks.bottomsrefresh = this.renderOptions.bottomsrefresh;
    return this.dispatch('init', this.renderOptions);
};
