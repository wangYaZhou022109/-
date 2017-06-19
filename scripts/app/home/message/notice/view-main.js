var _ = require('lodash/collection'),
    $ = require('jquery');
exports.bindings = {
    list: true,
    readStatus: false,
    dataList: true
};

exports.events = {
    'click check-all': 'checkAll',
    'click check-item*': 'checkItem',
    'click details-*': 'detail'
};

exports.handlers = {
    checkAll: function(events, obj) {
        var i;
        var checked = this.$$('input[name="messageId"]');
        if (checked.length === 0) {
            this.app.message.error('请选择要标记的消息');
            return false;
        }
        for (i = 0; i < checked.length; i++) {
            checked[i].checked = obj.checked;
        }
        return checked;
        // this.$$('input[name="messageId"]').forEach(function(x) {
        //     var element = x || {};
        //     element.checked = obj.checked;
        // });
    },
    checkItem: function() {
        var flag = this.$$('input[name="messageId"]').length === this.$$('input[name="messageId"]:checked').length;
        this.$('check-all').checked = flag;
    },
    detail: function(id) {
        $(this.$('li-' + id)).removeClass('sub-text');
        $(this.$('li-' + id)).addClass('sub-text');
        window.open('#/message/detail/' + id, '_blank');
    }
};

exports.actions = {
    'click removeAll': 'removeAll',
    'click showRead': 'showRead',
    'click markRead': 'markRead',
    'click loadMore': 'loadMore'
};

exports.dataForActions = {
    removeAll: function() {
        var me = this;
        var data = {};
        var ids = [];
        var i;
        // this.$$('input[name="messageId"]:checked').forEach(function(x) {
        //     var element = x || {};
        //     var id = element.value;
        //     ids.push(id);
        // });
        var checked = this.$$('input[name="messageId"]:checked');
        if (checked.length === 0) {
            this.app.message.error('请选择要标记的消息');
            return false;
        }
        for (i = 0; i < checked.length; i++) {
            ids.push(checked[i].value);
        }
        if (ids.length === 0) {
            this.app.message.error('请选择要删除的消息');
            return false;
        }
        data.ids = ids.join(',');
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除这些消息?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    showRead: function() {
        var data = {};
        if (this.$('showRead').checked) {
            data.readStatus = '0';
        } else {
            data.readStatus = '';
        }
        return data;
    },
    markRead: function() {
        var i;
        var data = {};
        var ids = [];
        var checked = this.$$('input[name="messageId"]:checked');
        if (checked.length === 0) {
            this.app.message.error('请选择要标记的消息');
            return false;
        }
        for (i = 0; i < checked.length; i++) {
            ids.push(checked[i].value);
        }
        // console.log(checked[0].value);
        // console.log(checked instanceof Array);
        // checked.forEach(function(x) {
        //     var element = x || {};
        //     var id = element.value;
        //     ids.push(id);
        // });
        data.ids = ids.join(',');
        return data;
    },
};

exports.actionCallbacks = {
    removeAll: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init', this.module.renderOptions);
    },
    markRead: function() {
        this.app.message.success('标记成功！');
        this.module.dispatch('init', this.module.renderOptions);
    }
};

exports.dataForTemplate = {
    showMore: function(data) { // 是否显示加载更多
        var page = this.bindings.list.params.page;
        var pageSize = this.bindings.list.params.pageSize;
        var recordCount = data.list.recordCount;
        if (!recordCount || recordCount === 0) {
            return 0;
        }
        if (page * pageSize < recordCount) {
            // 页数加1
            this.bindings.list.params.page = page + 1;
            return 1;
        }
        return 2;
    },
    dataList: function(data) { // 拼接翻页数据
        var list = data.list.items;
        var dataList = this.bindings.dataList;
        _.map(list, function(opt) {
            var obj = opt;
            obj.isRead = false;
            if (obj.readStatus === 1) {
                obj.isRead = true;
            }
            dataList.data.push(obj);
        });
        return dataList.data;
    },
    readCheck: function(data) { // 是否显示只读
        var readStatus = data.readStatus.value;
        if (readStatus === '0') {
            return true;
        }
        return false;
    }
};
