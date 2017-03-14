exports.items = {
    main: 'main',
    search: 'search'
};

exports.store = {
    models: {
        classstaffs: {
            url: '../train/classstaff',
            type: 'pageable',
            root: 'items'
        },
        projectInfo: {},
        state: { data: { } }
    },
    callbacks: {
        init: function() {
            var classstaffs = this.models.classstaffs;
            var classId = this.models.state.data.classId;
            classstaffs.params = { classId: classId };
            return this.get(classstaffs);
        },
        search: function(payload) {
            var classstaffs = this.models.classstaffs;
            classstaffs.params = payload;
            return this.get(classstaffs);
        }
    }
};

exports.beforeRender = function() {
    var state = this.store.models.state.data;
    state = this.renderOptions.state;
    state.changed();
    return this.dispatch('init');
};
