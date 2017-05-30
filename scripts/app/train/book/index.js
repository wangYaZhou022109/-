exports.items = {
    main: 'main',
    'train/book-time': { isModule: true }
};

exports.store = {
    models: {
        projectInfo: { url: '../train/project' },
        book: { url: '../train/project/book' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var project = this.models.projectInfo,
                me = this,
                state = this.models.state;
            project.set(payload);
            state.data.role = payload.role;
            return me.get(project);
        },
        submit: function(payload) {
            var model = this.models.book,
                project = this.models.projectInfo,
                me = this;
            model.set(payload);
            me.save(model).then(function() {
                this.app.message.success('提交成功');
                me.get(project);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id, role: this.renderOptions.state.role });
};
