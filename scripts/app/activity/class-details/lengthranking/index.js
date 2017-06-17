exports.items = {
    lengthranking: 'lengthranking'
};

exports.store = {
    models: {
        members: {
            url: '../train/study-details/member'
        },
        course: {
            url: '../course-study/course-study-progress/total-study-time'
        },
        courseStudyProgresss: {
            url: '../train/study-details/study'
        }
    },

    callbacks: {
        init: function() {
            var members = this.models.members,
                course = this.models.course,
                courseStudyProgresss = this.models.courseStudyProgresss,
                me = this;
            members.params = { classId: '65524602-517c-4ade-bdb3-83f3f369b3ac' };
            courseStudyProgresss.params = { classId: '65524602-517c-4ade-bdb3-83f3f369b3ac' };
            me.get(courseStudyProgresss);
            me.get(members).then(function(data) {
                course.params = data[0];
                me.get(course);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
