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
        state: { data: { classId: 3 } }
    },
    callbacks: {
        init: function(payload) {
            var classstaffs = this.models.classstaffs;
            classstaffs.params = payload;
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
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
