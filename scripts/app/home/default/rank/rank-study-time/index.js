exports.items = {
    main: 'main',
    'home/default/more/rank/rank-study-time': { isModule: true }
};

exports.store = {
    models: {
        studyRank: { url: '../course-study/course-study-progress/rank-study-total-time' }
    },
    callbacks: {
        init: function(payload) {
            var studyRank = this.models.studyRank;
            studyRank.clear();
            studyRank.params.size = payload.size || 10;
            if (this.app.global.currentUser.id) {
                if (payload.dataSource !== '' && (payload.dataSource === '1' || payload.dataSource === 1)) {
                    studyRank.params.organizationId = this.app.global.currentUser.organization.id;
                } else {
                    studyRank.params.organizationId = this.app.global.currentUser.rootOrganization.id;
                }
            }
            return this.get(studyRank);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.rankModule);
};
