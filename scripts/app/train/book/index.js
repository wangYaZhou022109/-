exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        projectInfo: {},
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var project = this.models.projectInfo,
                me = this;
            project.options.url = '../train/project/' + payload.id;
            return me.get(project);
        },
        submit: function(payload) {
            console.log(payload);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id });
};
