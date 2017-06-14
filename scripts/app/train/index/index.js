exports.items = {
    top: 'top',
    main: 'main'
};

exports.store = {
    models: {
        projectInfo: { url: '../train/project' },
        classInfo: { url: '../train/class-info/find-by-project-id' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                projectInfo = this.models.projectInfo;
            state.data.menu = 'book';
            state.data.book = true;
            state.data.id = payload.id;
            state.data.role = payload.role;
            state.changed();
            projectInfo.set(payload);
            this.get(projectInfo);
        },
        changeMenu: function() {
            var classInfo = this.models.classInfo;
            var id = this.module.renderOptions.id;
            classInfo.set({ id: id });
            return this.get(classInfo);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id, role: this.renderOptions.role });
};
