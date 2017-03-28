exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        topicRank: { url: '../system/topic/rank-watch' }
    },
    callbacks: {
        init: function(payload) {
            var topicRank = this.models.topicRank;
            topicRank.clear();
            topicRank.params.size = payload.size || 10;
            return this.get(topicRank);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', { size: 10 });
};
