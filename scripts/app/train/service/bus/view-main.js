exports.bindings = {
    buss: true,
    bus: false,
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'buss' }
}];

exports.events = {
    'click addBus': 'addBus',
};

exports.handlers = {
    addBus: function() {
        var model = this.module.items.edit;
        this.bindings.bus.clear();
        this.app.viewport.modal(model, true);
    }
};

exports.actions = {
    'click publish*': 'publish',
    'click undo*': 'undo'
};

exports.dataForActions = {
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
    }
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
