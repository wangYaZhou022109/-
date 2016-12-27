exports.items = {
    data: 'data'
};

exports.store = {
    models: {
        course: {
            url: '../course-study/course-front'
        },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course;
            course.set({ id: payload.id });
            return this.get(course);
        },
    }
};
exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
