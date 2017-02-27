exports.items = {
    search: 'search',
    main: 'main'
};

exports.large = true;

exports.store = {
    models: {
        state: {},
        projects: { url: '../train/project/frontend', type: 'pageable', root: 'items' }
    },
    callbacks: {
        init: function() {
            var projects = this.models.projects;
            return this.get(projects);
        },
        search: function(payload) {
            var projects = this.models.projects;
            projects.params = payload;
            return this.get(projects);
        },
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
