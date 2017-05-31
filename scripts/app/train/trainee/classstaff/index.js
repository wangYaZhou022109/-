exports.items = {
    main: 'main',
    'train/trainee/select-member': { isModule: true }
};

exports.store = {
    models: {
        classstaffs: {
            url: '../train/classstaff',
            type: 'pageable',
            root: 'items'
        },
        classstaff: { url: '../train/classstaff' },
        memberIds: { url: '../train/classstaff/members' },
        addAllClassstaff: { url: '../train/classstaff/save-all' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var classstaffs = this.models.classstaffs;
            var state = this.models.state.data;
            state.classId = payload.classId;
            classstaffs.params = { classId: payload.classId };
            return this.get(classstaffs);
        },
        updateSort: function(payload) {
            var classstaff = this.models.classstaff;
            classstaff.clear();
            classstaff.set(payload);
            return this.put(classstaff);
        },
        delete: function(payload) {
            var classstaff = this.models.classstaff;
            classstaff.clear();
            classstaff.set(payload);
            return this.put(classstaff);
        },
        changeCallName: function(payload) {
            var classstaff = this.models.classstaff;
            classstaff.clear();
            classstaff.set(payload);
            return this.put(classstaff);
        },
        addClassstaff: function(payload) {
            var classstaff = this.models.classstaff;
            classstaff.clear();
            classstaff.set(payload);
            return this.save(classstaff);
        },
        addAllClassstaff: function(payload) {
            var addAllClassstaff = this.models.addAllClassstaff;
            addAllClassstaff.clear();
            addAllClassstaff.params = payload;
            return this.get(addAllClassstaff);
        },
        getMemberIds: function() {
            var memberIds = this.models.memberIds,
                state = this.models.state.data;
            memberIds.clear();
            memberIds.params = { classId: state.classId };
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
