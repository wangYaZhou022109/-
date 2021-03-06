exports.items = {
    main: 'main',
    search: 'search',
    situation: '',
    audit: '',
    detail: ''
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
        nations: { url: '../human/member-config/list', autoLoad: 'after', params: { key: 2 } },
        levels: { url: '../human/member-config/list', autoLoad: 'after', params: { key: 8 } },
        trainee: { url: '../train/trainee/update' },
        classInfo: { url: '../train/class-info/get' },
        detail: { data: {} },
        state: { data: {} }
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
                classInfo = this.models.classInfo,
                state = this.models.state.data,
                params = payload;
            params.quotaType = state.quotaType;
            params.className = classInfo.data.className;
            auditTrainee.set(params);
            return this.put(auditTrainee);
        },
        updateTrainee: function(payload) {
            var trainee = this.models.trainee;
            trainee.clear();
            trainee.set(payload);
            return this.put(trainee);
        },
        getClassInfo: function(payload) {
            var classInfo = this.models.classInfo;
            classInfo.params = { id: payload.classId };
            return this.get(classInfo);
        }
    }
};

exports.beforeRender = function() {
    var state = this.store.models.state;
    state.data.role = this.renderOptions.state.role;
    state.changed();
    this.dispatch('init', this.renderOptions.state);
    this.dispatch('getClassInfo', this.renderOptions.state);
};
