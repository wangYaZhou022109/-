exports.items = {
    menu: 'menu',
    list: 'list'
};

exports.store = {
    models: {
        state: { data: { menu: 'alldynamic' } }
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
