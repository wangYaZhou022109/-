exports.items = {
    menu: 'menu',
    list: 'list'
};

exports.store = {
    models: {
        state: { data: { menu: 'content' } }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            var id = payload;
            state.data = { menu: id };
            state.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions.id);
};
