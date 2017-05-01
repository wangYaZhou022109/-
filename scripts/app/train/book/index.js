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
                me = this;
            project.set(payload);
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
        },
        changeDate: function(payload) {
            var state = this.models.state,
                projectInfo = this.models.projectInfo.data,
                classInfo;
            classInfo = projectInfo.classInfo;
            if (classInfo) {
                classInfo.arriveDate = new Date(payload.arriveDate).getTime();
                classInfo.returnDate = new Date(payload.backDate).getTime();
            }
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id });
};
