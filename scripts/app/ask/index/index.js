exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: { data: { menu: 'content' } }
    },
    callbacks: {
        init: function() {
        }
    }
};


exports.afterRender = function() {
    return this.dispatch('init');
};
