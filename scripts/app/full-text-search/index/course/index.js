exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        courses: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var courses = this.models.courses;
            this.models.state.set(options.state);
            courses.params = {
                type: 0,
                publishClient: 1,
                searchContent: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(courses, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
