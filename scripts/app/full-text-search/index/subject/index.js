exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subjects: {
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
            var subjects = this.models.subjects;
            this.models.state.set(options.state);
            subjects.params = {
                type: 2,
                clientType: 1,
                searchContent: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(subjects, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
