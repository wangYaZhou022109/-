exports.items = {
    menu: 'menu',
    list: 'list'
};

exports.store = {
    models: {
        state: { data: { menu: 'alldynamic' } },
        attention: { url: '../ask-bar/trends/attention' }
    },
    callbacks: {
        init: function() {
            var attention = this.models.attention;
            attention.set({ id: 'default' });
            return this.get(attention);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
