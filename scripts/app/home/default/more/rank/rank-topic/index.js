exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        topicRank: { url: '../system/topic/rank-watch' }
    },
    callbacks: {
        init: function(payload) {
            // debugger;
            var topicRank = this.models.topicRank;
            topicRank.clear();
            topicRank.params.size = 30;
            if (this.app.global.currentUser.id) {
                if (payload.dataSource !== '' && (payload.dataSource === '1' || payload.dataSource === 1)) {
                    topicRank.params.organizationId = this.app.global.currentUser.organization.id;
                } else {
                    topicRank.params.organizationId = this.app.global.currentUser.rootOrganization.id;
                }
            }
            return this.get(topicRank);
        }
    }
};
exports.afterRender = function() {
    // debugger;
    this.dispatch('init', this.renderOptions);
};
