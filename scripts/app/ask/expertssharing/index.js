

exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/experts-sharing' }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends,
                id = 'all';
            if (typeof payload.state.id !== 'undefined') {
                id = payload.state.id;
            }
            trends.set({ id: id });
            return this.get(trends);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
