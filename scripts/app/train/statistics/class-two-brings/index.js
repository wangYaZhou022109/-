
exports.items = {
    main: 'main',
    search: 'search',
    'train/statistics/navigate-tree': { isModule: true, uri: 'human/member' },
    edit: ''
};

exports.store = {
    models: {
        classTwoBrings: {
            url: '../train/class-two-brings/background',
            type: 'pageable',
            root: 'items'
        },
        classTwoBring: { url: '../train/class-two-brings' },
        download: { url: '../train/class-two-brings/download' },
        state: { data: { } },
        org: { data: { } }
    },
    callbacks: {
        init: function(payload) {
            var classTwoBrings = this.models.classTwoBrings,
                state = this.models.state;
            classTwoBrings.params = payload;
            state.data.classId = payload.classId;
            return this.get(classTwoBrings);
        },
        search: function(payload) {
            var classTwoBrings = this.models.classTwoBrings,
                org = this.models.org;
            classTwoBrings.params = payload;
            this.get(classTwoBrings);
            org.clear();
        },
        edit: function(payload) {
            var model = this.models.classTwoBring,
                me = this,
                state = this.models.state;
            state.data.id = payload.id;
            model.clear();
            model.params = state.data;
            return me.get(model);
        }
    }
};


exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
