exports.items = {
    tab: 'tab',
    main: 'main'
};

exports.store = {
    models: {
        projectInfo: {},
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            state.data.tab = 'fmtrainee';
            state.data.fmtrainee = true;
            state.data.id = payload.id;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};