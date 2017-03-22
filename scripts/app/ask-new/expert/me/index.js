exports.items = {
    main: 'main',
    side: 'side',
    top: 'top',
    'ask-new/follow-me': { isModule: true },
    'picker/select-topic': { isModule: true }
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
