exports.items = {
    main: 'main',
    search: 'search'
};

exports.large = true;

exports.title = '问卷提交情况';

exports.store = {
    models: {
        state: {},
        trainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        organizations: { url: '../train/class-quota/list' }
    },
    callbacks: {
        init: function(payload) {
            var trainees = this.models.trainees,
                state = this.models.state;
            state.clear();
            state.data = payload;
            state.data.auditStatus = 1;
            trainees.params = state.data;
            return this.get(trainees);
        },
        search: function(payload) {
            var trainees = this.models.trainees;
            trainees.params = payload;
            return this.get(trainees);
        },
        organizations: function(payload) {
            var organizations = this.models.organizations;
            organizations.clear();
            organizations.params = payload;
            return this.get(organizations);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { classId: this.renderOptions.classId });
    this.dispatch('organizations', { classId: this.renderOptions.classId });
};
