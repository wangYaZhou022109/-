var D = require('drizzlejs');
var $ = require('jquery');
exports.bindings = {
    buss: true,
    bus: false,
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'buss' }
}];

exports.events = {
    'click count*': 'count',
    'click addBus': 'addBus'
};

exports.handlers = {
    count: function(id, e, target) {
        var region;
        var el = $(target).parents('.div')[0];
        var model = this.module.items['train/service/bus/bus-detail'];
        region = new D.Region(this.app, this.module, el, id);
        region.show(model, { id: id });
    },
    addBus: function() {
        this.bindings.bus.clear();
        this.app.viewport.modal(this.module.items.edit);
    },
};

exports.actions = {
    'click remove*': 'remove',
    'click publish*': 'publish',
    'click undo*': 'undo',
    'click editBus*': 'editBus',
};

exports.dataForActions = {
    editBus: function(data) {
        this.app.viewport.modal(this.module.items.edit);
        return data;
    },
    publish: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定发布该主题?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    undo: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定取消发布该主题?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    remove: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除这条数据吗?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
};

exports.actionCallBacks = {
    publish: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    },
    undo: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    },
};
