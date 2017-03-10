
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/attentionselection' },
        concern: { url: '../ask-bar/trends/concern' }
    },
    callbacks: {
        init: function() {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
            return this.get(trends);
        },
        end: function(payload) {
            var concern = this.models.concern;
            concern.set(payload);
            return this.post(concern);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
