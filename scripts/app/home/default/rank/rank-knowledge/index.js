exports.items = {
    main: 'main',
    'home/default/more/rank/rank-knowledge': { isModule: true }
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
            if (this.app.global.currentUser.id) {
                if (payload.dataSource !== '' && (payload.dataSource === '1' || payload.dataSource === 1)) {
                    rank.params.organizationId = this.app.global.currentUser.organization.id;
                } else {
                    rank.params.organizationId = this.app.global.currentUser.rootOrganization.id;
                }
            }
            return this.get(rank);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.rankModule);
};
