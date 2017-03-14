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
            state.data.tab = 'manage';
            state.data.manage = true;
            state.data.classId = payload.classId;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
