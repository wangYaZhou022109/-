var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        list: {
            url: '../ask-bar/my-follow/question',
            type: 'pageable',
            root: 'items'
        },
        img: { url: '../human/file/download?id=' },
        object: { url: '../ask-bar/question' },
        search: {},
        unfollow: { url: '../ask-bar/concern/unfollow' },
        discuss: { url: '../ask-bar/question-discuss' },
    },
    callbacks: {
        init: function() {
            var list = this.models.list,
                searchModel = this.models.search;
            list.clear();
            D.assign(list.params, searchModel.data);
            return this.get(list);
        },
        search: function(params) {
            var searchModel = this.models.search,
                list = this.models.list;
            D.assign(list.params, D.assign(searchModel.data, params));
            this.get(list);
            searchModel.changed();
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            follow.set(payload);
            return this.put(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
