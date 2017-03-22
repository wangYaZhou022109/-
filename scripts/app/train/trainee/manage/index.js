exports.items = {
    main: 'main',
    search: 'search',
    situation: '',
    audit: ''
};

exports.store = {
    models: {
        trainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        situation: { url: '../train/class-quota/situation' },
        auditTrainee: { url: '../train/trainee/audit' },
        state: { data: { auditStatus: 0 } }
    },
    callbacks: {
        init: function(payload) {
            var trainees = this.models.trainees,
                state = this.models.state;
            trainees.clear();
            state.data.classId = payload.classId;
            state.data.quotaType = payload.quotaType;
            trainees.params = state.data;
            state.changed();
            return this.get(trainees);
        },
        search: function(payload) {
            var trainees = this.models.trainees;
            trainees.clear();
            trainees.params = payload;
            return this.get(trainees);
        },
        situation: function() {
            var classId = this.models.state.data.classId,
                situation = this.models.situation;
            situation.clear();
            situation.params = { classId: classId };
            return this.get(situation);
        },
        auditTrainee: function(payload) {
            var auditTrainee = this.models.auditTrainee,
                state = this.models.state.data,
                params = payload;
            params.quotaType = state.quotaType;
            auditTrainee.set(params);
            return this.put(auditTrainee);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.state);
};
