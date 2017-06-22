var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false,
    logicDel: true
};

exports.events = {
    'click edit*': 'showEdit'
};

exports.handlers = {
    showEdit: function(data) {
        var me = this,
            params = me.bindings.list.params;
        this.app.viewport.modal(this.module.items['knowledge/index/modal'], {
            data: { id: data },
            state: 'edit',
            callbacks: function() {
                me.app.message.success('操作成功');
                me.module.dispatch('search', params);
            }
        });
    }
};


exports.actions = {
    'click delete*': 'delete'
};

exports.dataForActions = {
    delete: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除该知识?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    delete: function() {
        this.app.message.success('删除成功');
        this.module.dispatch('init');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl(),
            icon = '';
        _.map(list, function(opt) {
            var obj = opt;
            if (obj.type === 0) {
                icon = 'icon-mp4';
            } else if (obj.type === 1) {
                icon = 'icon-mp3';
            } else if (obj.type === 2) {
                icon = 'icon-word';
            } else if (obj.type === 3) {
                icon = 'icon-pdf';
            } else if (obj.type === 4) {
                icon = 'icon-excel';
            } else if (obj.type === 5) {
                icon = 'icon-ppt';
            } else if (obj.type === 6) {
                icon = 'icon-mp4';
            } else {
                icon = 'icon-zhishiku';
            }
            obj.icon = obj.cover ? (downUrl + '?id=' + obj.cover) : icon;
            obj.prefixText = '上传时间：' + helpers.dateMinute(obj.uploadTime);

            obj.downloadMemberCount = obj.downloadMemberCount == null ? 0 : obj.downloadMemberCount;
            obj.browseCount = obj.browseCount == null ? 0 : obj.browseCount;
            obj.downAndViewText = '下载：' + obj.downloadMemberCount + ' ｜ 浏览：' + obj.browseCount;
            obj.btnUrl = '#/knowledge/details/' + obj.id;
            return obj;
        });
        return list;
    }
};
