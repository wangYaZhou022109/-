exports.items = {
    main: 'main',
    search: 'search',
    situation: ''
};

exports.store = {
    models: {
        trainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        projectInfo: {},
        state: { data: { classId: 3, auditStatus: 0 } },
        situation: { url: '../train/class-quota/situation' }
    },
    callbacks: {
        init: function(payload) {
            var trainees = this.models.trainees;
            trainees.params = payload;
            return this.get(trainees);
        },
        search: function(payload) {
            var trainees = this.models.trainees;
            trainees.params = payload;
            return this.get(trainees);
        },
        situation: function() {
            var classId = this.models.state.data.classId,
                situation = this.models.situation;
            situation.clear();
            situation.params = { classId: classId };
            return this.get(situation);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
