
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/news' }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends;
            trends.set({ id: payload.state.data.topicId });
            return this.get(trends);
        }
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.state.data;
    if (typeof data.topicId !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
