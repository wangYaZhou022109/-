exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        researchs: {
            url: '../exam/research-activity/activity-list',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var researchs = this.models.researchs;
            this.models.state.set(options.state);
            researchs.params = {
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(researchs, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
