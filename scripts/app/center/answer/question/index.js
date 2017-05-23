var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        list: {
            url: '../ask-bar/question/person-question-list',
            type: 'pageable',
            root: 'items'
        },
        img: { url: '../human/file/download?id=' },
        object: { url: '../ask-bar/question' },
        speech: { url: '../system/speech-set', autoLoad: 'after' },
        search: { data: { type: '1' } },
    },
    callbacks: {
        init: function(payload) {
            var list = this.models.list,
                menuId = payload.state.menuId,
                searchModel = this.models.search;
            if (menuId === '0') {
                searchModel.data.type = '1';
            } else if (menuId === '1') {
                searchModel.data.type = '2';
            }
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
        remove: function(payload) {
            var object = this.models.object,
                me = this;
            object.set(payload);
            return me.del(object).then(function() {
                me.app.message.success('删除成功');
                return me.get(me.models.list);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
