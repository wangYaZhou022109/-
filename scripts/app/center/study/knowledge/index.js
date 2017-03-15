var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter',
    //  'course-study/knowledge/add-knowledge': { isModule: true }
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
        object: { url: '../course-study/knowledge' }
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
            D.assign(list.params, D.assign(searchModel.data, params));
            this.get(list);
            searchModel.changed();
        },
        delete: function(payload) {
            var object = this.models.object,
                me = this;
            object.set(payload);
            return me.del(object).then(function() {
                return me.get(me.models.list);
            });
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
