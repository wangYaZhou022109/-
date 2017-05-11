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
    this.options.store.callbacks.leftrefresh = this.renderOptions.leftrefresh;
    this.options.store.callbacks.bottomsrefresh = this.renderOptions.bottomsrefresh;
    this.options.store.callbacks.refresh = this.renderOptions.refresh;
    return this.dispatch('init', this.renderOptions.id);
};
