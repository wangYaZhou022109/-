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
        download: { url: '../train/class-two-brings/download' },
        state: { data: { } }
    },
    callbacks: {
        init: function(payload) {
            var classTwoBrings = this.models.classTwoBrings,
                state = this.models.state;
            classTwoBrings.params = payload;
            state.data.classId = payload;
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
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
