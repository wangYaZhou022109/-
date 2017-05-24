exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        studyRank: { url: '../course-study/course-study-progress/rank-finish-course' }
    },
    callbacks: {
        init: function(payload) {
            var studyRank = this.models.studyRank;
            studyRank.clear();
            studyRank.params.size = payload.size || 10;
            if (this.app.global.currentUser.id) {
                if (payload.dataSource !== '' && payload.dataSource === 1) {
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
    // this.dispatch('init', { size: 10 });
    this.dispatch('init', this.renderOptions.rankModule);
};
