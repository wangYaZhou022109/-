exports.items = {
    main: 'main',
    search: 'search',
    'train/trainee/fmtrainee/select-member': { isModule: true }
};

exports.store = {
    models: {
        fmtrainees: {
            url: '../train/trainee/fmtrainees',
            type: 'pageable',
            root: 'items'
        },
        agreeFmtrainee: { url: '../train/trainee/updateStatus' },
        projectInfo: {},
        state: { data: { classId: 3 } }
    },
    callbacks: {
        init: function(payload) {
            var fmtrainees = this.models.fmtrainees;
            fmtrainees.params = payload;
            return this.get(fmtrainees);
        },
        search: function(payload) {
            var fmtrainees = this.models.fmtrainees;
            fmtrainees.params = payload;
            return this.get(fmtrainees);
        },
        agree: function(payload) {
            var agreeFmtrainee = this.models.agreeFmtrainee;
            agreeFmtrainee.clear();
            agreeFmtrainee.set(payload);
            return this.put(agreeFmtrainee);
        },
        refuse: function(payload) {
            var agreeFmtrainee = this.models.agreeFmtrainee;
            agreeFmtrainee.clear();
            agreeFmtrainee.set(payload);
            return this.put(agreeFmtrainee);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
