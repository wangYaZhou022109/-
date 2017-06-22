var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter',
    'knowledge/index/modal': { isModule: true }
};

exports.store = {
    models: {
        list: {
            url: '../course-study/knowledge/person-list',
            type: 'pageable',
            root: 'items'
        },
        img: { url: '../human/file/download' },
        search: {},
        object: { url: '../course-study/knowledge' },
        logicDel: { url: '../course-study/knowledge/logicDel' }
    },
    callbacks: {
        init: function() {
            var list = this.models.list;
            list.clear();
            return this.get(list);
        },
        search: function(params) {
            var searchModel = this.models.search,
                list = this.models.list;
            list.clear();
            D.assign(list.params, D.assign(searchModel.data, params));
            this.get(list);
            searchModel.changed();
        },
        delete: function(payload) {
            var logicDel = this.models.logicDel,
                me = this;
            logicDel.set(payload);
            return me.put(logicDel).then(function() {
                return me.get(me.models.list);
            });
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
