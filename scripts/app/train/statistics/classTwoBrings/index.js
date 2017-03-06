exports.items = {
    main: 'main',
    search: 'search',
    edit: ''
};

exports.store = {
    models: {
        classTwoBrings: {
            url: '../train/classTwoBrings/background',
            type: 'pageable',
            root: 'items'
        },
        classTwoBring: { url: '../train/classTwoBrings' },
        download: { url: '../train/classTwoBrings/download' },
        state: { data: { classId: 3, auditStatus: 1 } }
    },
    callbacks: {
        init: function(payload) {
            var classTwoBrings = this.models.classTwoBrings;
            classTwoBrings.params = payload;
            return this.get(classTwoBrings);
        },
        search: function(payload) {
            var classTwoBrings = this.models.classTwoBrings;
            classTwoBrings.params = payload;
            return this.get(classTwoBrings);
        },
        edit: function(payload) {
            var model = this.models.classTwoBring,
                me = this;
            model.clear();
            model.params = payload;
            return me.get(model);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
