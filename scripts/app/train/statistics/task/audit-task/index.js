exports.items = {
    head: 'head',
    main: 'main',
    side: 'side',
};

exports.store = {
    models: {
        all: {
            url: '../train/task-detail/all',
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var all = this.models.all,
                id = payload;
            all.params = { id: id };
            return this.get(all);
        },
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions.id);
};

