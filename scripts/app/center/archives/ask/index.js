exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        list: { url: '../ask-bar/question/person-list', type: 'pageable', root: 'items' },
        export: { url: '../ask-bar/question/export-person-list' }
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
