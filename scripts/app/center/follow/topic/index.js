var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        list: { url: '../ask-bar/my-follow/topic' },
        topicType: { url: '../system/topic-type' },
        img: { url: '../human/file/download?id=' },
        search: {},
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
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
    this.dispatch('topicType');
};
