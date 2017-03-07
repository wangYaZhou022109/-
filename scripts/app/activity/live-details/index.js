exports.items = {
    live: 'live',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        gensee: { url: '../course-study/gensee-student/detail' },
        courses: { url: '../course-study/gensee-student/course' },
        down: { url: '../human/file/download' },
    },
    callbacks: {
        init: function(params) {
            var gensee = this.models.gensee,
                course = this.models.courses;
            gensee.set(params);
            course.set(params);
            this.get(gensee);
            this.get(course);
        },
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.genseeId });
};
