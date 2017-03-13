exports.items = {
    popup: 'popup',
    main: 'main',
    'ask/question': { isModule: true },
    'ask/article': { isModule: true }
};


exports.store = {
    models: {
        popupstate: {}
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
