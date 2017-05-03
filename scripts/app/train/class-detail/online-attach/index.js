
exports.title = '下载附件';
exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        course: {
            url: '../course-study/course-front/info'
        },
        download: { url: '../human/file/download' }
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course;
            course.set({ id: payload });
            return this.get(course);
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.id);
};
