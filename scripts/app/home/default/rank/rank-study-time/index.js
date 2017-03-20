exports.items = {
    main: 'main'
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
            return this.get(studyRank);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', { size: 10 });
};
