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
            state.data.tab = 'sign';
            state.data.sign = true;
            state.data.id = payload.id.id;
            state.data.classId = payload.id.classId;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state });
};
