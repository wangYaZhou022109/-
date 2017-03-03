exports.items = {
    main: 'main',
    search: 'search'
};

exports.store = {
    models: {
        iftrainees: {
            url: '../train/trainee/iftrainees',
            type: 'pageable',
            root: 'items'
        },
        projectInfo: {},
        state: { data: { classId: 3 } }
    },
    callbacks: {
        init: function(payload) {
            var iftrainees = this.models.iftrainees;
            iftrainees.params = payload;
            return this.get(iftrainees);
        },
        search: function(payload) {
            var iftrainees = this.models.iftrainees;
            iftrainees.params = payload;
            return this.get(iftrainees);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
