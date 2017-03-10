
exports.items = {
    list: 'list',
    popup: 'popup'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/related-to-me' },
        popupstate: {}
    },
    callbacks: {
        init: function() {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
            return this.get(trends);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
