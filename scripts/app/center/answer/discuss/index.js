var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        list: {
            url: '../ask-bar/my-reply/person-list',
            type: 'pageable',
            root: 'items'
        },
        img: { url: '../human/file/download?id=' },
        reply: { url: '../ask-bar/question-reply' },
        discuss: { url: '../ask-bar/question-discuss' },
        search: { data: { } },
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
        remove: function(payload) {
            var model = payload.objectType === 1 ? this.models.discuss : this.models.reply,
                me = this;
            model.set(payload);
            return me.del(model).then(function() {
                return me.get(me.models.list);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
