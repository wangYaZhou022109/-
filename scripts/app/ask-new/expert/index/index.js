exports.items = {
    main: 'main',
    side: 'side',
    'ask-new/apply-expert-aptitude': { isModule: true },
    'ask-new/apply-expert-info': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'expert';
            state.data.archives = true;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
