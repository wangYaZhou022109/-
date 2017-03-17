exports.items = {
    main: 'main',
    search: 'search',
    'train/statistics/class-two-brings/owner': { isModule: true },
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
        download: { url: '../train/class-two0brings/download' },
        state: { data: { classId: 3 } }
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
