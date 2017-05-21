exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        lives: {
            url: '../course-study/gensee/details',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var lives = this.models.lives;
            this.models.state.set(options.state);
            lives.params = {
                clientType: 1,
                subject: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(lives, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
