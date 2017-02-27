exports.items = {
    top: 'top',
    main: 'main'
};

exports.store = {
    models: {
        projectInfo: { url: '../train/project' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                projectInfo = this.models.projectInfo;
            state.data.menu = 'book';
            state.data.book = true;
            state.data.id = payload.id;
            state.changed();
            projectInfo.set(payload);
            this.get(projectInfo);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
