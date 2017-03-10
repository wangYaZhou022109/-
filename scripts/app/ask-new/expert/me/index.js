exports.items = {
    main: 'main',
    side: 'side',
    'ask-new/follow-me': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'follow';
            state.data.archives = true;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
