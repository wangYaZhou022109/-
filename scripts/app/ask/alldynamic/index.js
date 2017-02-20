
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/all-dynamic' }
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
    return this.dispatch('init');
};
