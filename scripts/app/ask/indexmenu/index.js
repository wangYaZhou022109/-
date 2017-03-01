exports.items = {
    main: 'main',
    popup: 'popup'
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
