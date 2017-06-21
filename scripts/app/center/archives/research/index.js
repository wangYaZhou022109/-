exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        list: { url: '../exam/research-record/person-list', type: 'pageable', root: 'items' },
        export: { url: '../exam/research-record/export-person-list' }
    },
    callbacks: {
        init: function() {
            var me = this,
                list = me.models.list;
            list.clear();
            me.get(list, { loading: true });
        }
    }
};


exports.beforeRender = function() {
    this.dispatch('init');
};
