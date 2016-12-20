exports.items = {
    info: 'info',
    comment: 'comment'
};

exports.store = {
    models: {
        course: { url: '../course-study/course-front' }
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course;
            course.set({ id: payload.courseId });
            return this.chain(this.get(course));
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
