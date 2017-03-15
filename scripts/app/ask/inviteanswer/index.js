

exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/expert-answer' }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends;
            trends.set({ id: payload.state.id });
            return this.get(trends);
        }
    }
};

exports.afterRender = function() {
    if (typeof this.renderOptions.state.id !== 'undefined' && this.renderOptions.state.id !== '') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};

