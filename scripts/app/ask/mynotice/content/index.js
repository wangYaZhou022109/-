exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        content: { url: '../ask-bar/trends/attention-content' }
    },
    callbacks: {
        init: function() {
            var content = this.models.content;
            content.set({ id: 1222 });
            return this.get(content);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
