var D = require('drizzlejs');

exports.title = '我的消息';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        list: {
            url: '../system/message',
            params: { type: 1 }
        },
        img: { url: '../human/file/download?id=' },
        readStatus: { data: { value: '' } },
        removeAll: { url: '../system/message/removeAll' },
        markRead: { url: '../system/message/markRead' },
        dataList: { data: [] }, // 用于拼接组合分页数据
        scrollFlag: { data: false }
    },
    callbacks: {
        init: function() {
            var list = this.models.list;
            list.clear();
            this.models.dataList.data = []; // 组合数据清空
            D.assign(list.params, { page: 1, pageSize: 10 }); // 重置分页
            return this.get(list);
        },
        showRead: function(payload) {
            var list = this.models.list;
            list.clear();
            this.models.dataList.data = []; // 组合数据清空
            if (payload.readStatus) {
                this.models.readStatus.data.value = '0';
            } else {
                this.models.readStatus.data.value = '';
            }
            D.assign(list.params, payload);
            D.assign(list.params, { page: 1, pageSize: 10 }); // 重置分页
            return this.get(list);
        },
        removeAll: function(payload) {
            var removeAll = this.models.removeAll;
            removeAll.set(payload);
            return this.put(removeAll);
        },
        markRead: function(payload) {
            var markRead = this.models.markRead;
            markRead.set(payload);
            return this.put(markRead);
        },
        loadMore: function() {
            var list = this.models.list;
            return this.get(list);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
