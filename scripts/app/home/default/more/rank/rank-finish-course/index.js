exports.items = {
    main: 'main'
};

exports.title = function() {
    return this.renderOptions.rankModule.name;
};

exports.store = {
    models: {
        studyRank: { url: '../course-study/course-study-progress/rank-finish-course' },
        myRankCount: { url: '../course-study/course-study-progress/getCourseRank' }
    },
    callbacks: {
        init: function(payload) {
            var studyRank = this.models.studyRank,
                myRankCount = this.models.myRankCount,
                organizationId;
            studyRank.clear();
            studyRank.params.size = 100;
            if (this.app.global.currentUser.id) {
                if (payload.dataSource !== '' && (payload.dataSource === '1' || payload.dataSource === 1)) {
                    organizationId = this.app.global.currentUser.organization.id;
                } else {
                    organizationId = this.app.global.currentUser.rootOrganization.id;
                }
                myRankCount.clear();
                myRankCount.params.organizationId = organizationId;
                this.get(myRankCount);
                studyRank.params.organizationId = organizationId;
            }
            return this.get(studyRank);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.rankModule);
};
