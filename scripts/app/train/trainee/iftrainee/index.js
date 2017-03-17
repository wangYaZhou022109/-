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
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
