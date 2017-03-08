exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        list: { url: '../exam/exam-record/person-list', type: 'pageable', root: 'items' },
        export: { url: '../exam/exam-record/export-person-list' }
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
