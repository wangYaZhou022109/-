exports.items = {
    main: 'main',
    'train/statistics/study-details/particulars': { isModule: true }
};

exports.store = {
    models: {
        courseStudyProgresss: {
            url: '../train/study-details/study'
        },
        state: { data: { } }
    },
    callbacks: {
        init: function(payload) {
            var courseStudyProgresss = this.models.courseStudyProgresss,
                state = this.models.state;
            state.data.classId = payload.classId;
            courseStudyProgresss.params = payload;
            return this.get(courseStudyProgresss);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
