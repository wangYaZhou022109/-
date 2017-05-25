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
            state.data.tab = 'questionnaire';
            state.data.classId = payload.classId;
            state.data.role = payload.role;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', {
        classId: this.renderOptions.state.classId,
        role: this.renderOptions.state.role
    });
};
