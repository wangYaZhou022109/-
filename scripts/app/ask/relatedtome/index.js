
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/related-to-me' }
    },
    callbacks: {
        init: function() {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
            return this.get(trends);
        },
        end: function() {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
            return this.get(trends);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
