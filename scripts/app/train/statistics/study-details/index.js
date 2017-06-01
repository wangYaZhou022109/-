exports.items = {
    main: 'main',
    'train/statistics/study-details/particulars': { isModule: true }
};

exports.store = {
    models: {
        courseStudyProgresss: {
            url: '../train/study-details/study'
        },
        member: {
            url: '../train/study-details/member'
        },
        course: {
            url: '../course-study/course-study-progress/total-study-time'
        },
        state: { data: { } }
    },
    callbacks: {
        init: function(payload) {
            var courseStudyProgresss = this.models.courseStudyProgresss,
                member = this.models.member,
                course = this.models.course,
                state = this.models.state,
                me = this;
            state.data.classId = payload.classId;
            courseStudyProgresss.params = payload;
            member.params = payload;
            me.get(courseStudyProgresss);
            me.get(member).then(function(data) {
                course.params = data[0];
                me.get(course);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
