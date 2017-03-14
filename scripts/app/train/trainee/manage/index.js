exports.items = {
    main: 'main',
    search: 'search',
    situation: '',
    audit: '',
    auditAll: ''
};

exports.store = {
    models: {
        trainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        situation: { url: '../train/class-quota/situation' },
        auditTrainee: { url: '../train/trainee/updateStatus' },
        auditAll: { url: '../train/trainee/auditAll' },
        state: { data: { auditStatus: 0 } }
    },
    callbacks: {
        init: function(payload) {
            var trainees = this.models.trainees,
                state = this.models.state;
            trainees.clear();
            state.data.classId = payload.classId;
            trainees.params = state.data;
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
            var auditTrainee = this.models.auditTrainee;
            auditTrainee.set(payload);
            return this.put(auditTrainee);
        },
        auditAllTrainees: function(payload) {
            var auditAll = this.models.auditAll;
            auditAll.set(payload);
            return this.put(auditAll);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
