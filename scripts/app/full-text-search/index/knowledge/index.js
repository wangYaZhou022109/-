exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        knowledges: {
            url: '../course-study/knowledge/front',
            type: 'pageable',
            pageSize: 20,
            root: 'items',
        },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var knowledges = this.models.knowledges;
            this.models.state.set(options.state);
            knowledges.params = {
                clientType: 1,
                orderType: 0,
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(knowledges, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
