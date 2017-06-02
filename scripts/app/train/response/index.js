exports.items = {
    search: 'search',
    main: 'main',
    'train/response/trainees': { isModule: true },
    'train/response/organizations': { isModule: true },
    'train/response/papers': { isModule: true }
};
exports.store = {
    models: {
        state: {},
        classinfos: { url: '../train/class-info/response', type: 'pageable', root: 'items' }
    },
    callbacks: {
        init: function() {
            var classinfos = this.models.classinfos;
            return this.get(classinfos);
        },
        search: function(payload) {
            var classinfos = this.models.classinfos;
            classinfos.clear();
            classinfos.params = payload;
            return this.get(classinfos);
        },
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
