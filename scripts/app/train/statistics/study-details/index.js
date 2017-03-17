exports.items = {
    main: 'main',
    'train/statistics/study-details/particulars': { isModule: true }
};

exports.store = {
    models: {
        courseStudyProgresss: {
            url: '../train/trainee/course-study-progresss',
            type: 'pageable',
            root: 'items'
        },
        state: { data: { classId: 3 } }
    },
    callbacks: {
        init: function(payload) {
            var courseStudyProgresss = this.models.courseStudyProgresss;
            courseStudyProgresss.params = payload;
            return this.get(courseStudyProgresss);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
