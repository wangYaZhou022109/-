exports.items = {
    popup: 'popup',
    main: 'main'
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
