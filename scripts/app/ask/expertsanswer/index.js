

exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/expert-answer' }
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
    console.log(this.renderOptions);
    return this.dispatch('init');
};

