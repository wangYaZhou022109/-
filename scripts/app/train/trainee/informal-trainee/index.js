exports.items = {
    main: 'main',
    'train/trainee/select-member': { isModule: true }
};

exports.store = {
    models: {
        iftrainees: {
            url: '../train/trainee/iftrainees',
            type: 'pageable',
            root: 'items'
        },
        addIftrainee: { url: '../train/trainee/add-trainee' },
        memberIds: { url: '../train/trainee/members' },
        addAllIftrainee: { url: '../train/trainee/add-trainees' },
        iftrainee: { url: '../train/trainee' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var iftrainees = this.models.iftrainees;
            var state = this.models.state.data;
            state.classId = payload.classId;
            iftrainees.params = payload;
            return this.get(iftrainees);
        },
        addIftrainee: function(payload) {
            var addIftrainee = this.models.addIftrainee;
            addIftrainee.clear();
            addIftrainee.set(payload);
            return this.save(addIftrainee);
        },
        addAllIftrainee: function(payload) {
            var addAllIftrainee = this.models.addAllIftrainee;
            addAllIftrainee.clear();
            addAllIftrainee.set(payload);
            return this.save(addAllIftrainee);
        },
        delete: function(payload) {
            var iftrainee = this.models.iftrainee;
            iftrainee.clear();
            iftrainee.set(payload);
            return this.del(iftrainee);
        },
        getMemberIds: function() {
            var memberIds = this.models.memberIds,
                state = this.models.state.data;
            memberIds.clear();
            memberIds.params = { classId: state.classId, type: 1 };
            return this.get(memberIds);
        }
    }
};

exports.beforeRender = function() {
    var state = this.store.models.state;
    state.data.role = this.renderOptions.state.role;
    state.changed();
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
