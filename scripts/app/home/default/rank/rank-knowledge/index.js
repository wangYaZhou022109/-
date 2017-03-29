exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        rank: { url: '../course-study/knowledge/rank-browse-count' }
    },
    callbacks: {
        init: function(payload) {
            var rank = this.models.rank;
            rank.clear();
            rank.params.size = payload.size || 10;
            return this.get(rank);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', { size: 10 });
};
