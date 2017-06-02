exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        specialist: {
            url: '../ask-bar/expert/queryExpert',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var specialist = this.models.specialist;
            this.models.state.set(options.state);
            specialist.params = {
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(specialist, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
