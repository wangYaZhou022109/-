exports.title = '班车/订餐信息';

exports.bindings = {
    buss: true,
    bus: false,
    optionList: true,
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'buss' }
}];

exports.events = {
    'click count*': 'count',
    'click addBus': 'addBus'
};

exports.handlers = {
    count: function(data) {
        var me = this,
            model = this.module.items['train/service/bus/bus-detail'];
        me.app.viewport.modal(model, { id: data });
    },
    addBus: function() {
        var buss = this.bindings.buss.data,
            optionList = [],
            option1 = {},
            option2 = {},
            option3 = {},
            option4 = {},
            option5 = {},
            option6 = {};
        this.bindings.optionList.clear();
        if (buss.length === 0) {
            option1.name = '返程日前一天17:30去集团';
            option1.id = option1.name;
            optionList.push(option1);
            option2.name = '返程日前一天17:30去机场';
            option2.id = option2.name;
            optionList.push(option2);
            option3.name = '返程日7:30去集团';
            option3.id = option3.name;
            optionList.push(option3);
            option4.name = '返程日7:30去机场';
            option4.id = option4.name;
            optionList.push(option4);
            option5.name = '返程日前一天晚餐';
            option5.id = option5.name;
            optionList.push(option5);
            option6.name = '返程日早餐';
            option6.id = option6.name;
            optionList.push(option6);
            this.bindings.optionList.data = optionList;
            this.bindings.optionList.changed();
        } else {
            this.bindings.bus.clear();
        }
        this.app.viewport.modal(this.module.items.edit);
    },
};

exports.actions = {
    'click remove*': 'remove',
    'click publish*': 'publish',
    'click undo*': 'undo',
    'click edit*': 'editBus',
};

exports.dataForActions = {
    editBus: function(payload) {
        this.app.viewport.modal(this.module.items.edit);
        return payload;
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
