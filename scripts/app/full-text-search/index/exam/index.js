exports.items = {
    main: 'main',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        exams: {
            url: '../exam/exam/activity-list',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var exams = this.models.exams;
            this.models.state.set(options.state);
            exams.params = {
                clientType: 1,
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(exams, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
