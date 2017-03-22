exports.items = {
    main: 'main',
    side: 'side',
    'ask/apply-topic': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'topic';
            state.data.archives = true;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
