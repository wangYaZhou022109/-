exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        list: { url: '../train/trainee/person-list', type: 'pageable', root: 'items' },
        export: { url: '../train/trainee/export-person-list' }
    },
    callbacks: {
        init: function() {
            var me = this,
                list = me.models.list;
            list.clear();
            me.get(list);
        }
    }
};


exports.beforeRender = function() {
    this.dispatch('init');
};
