var $ = require('jquery');

exports.title = '班车/订餐信息发布';

exports.type = 'form';

exports.bindings = {
    buss: true,
    bus: true,
    optionList: true,
    state: false,
};

exports.events = {
    'click addOption': 'addOption',
    'click label-option-*': 'changeName',
    'change input-option-*': 'updateName',
    'change input-explain-*': 'updateExplain',
    'click del-option-*': 'delOption',
};

exports.handlers = {
    changeName: function(id) {
        $(this.$('input-option-' + id)).css('display', 'block');
        $(this.$('label-option-' + id)).css('display', 'none');
    },
    updateName: function(id) {
        var val = $(this.$('input-option-' + id)).val();
        var explain = $(this.$('input-explain-' + id)).val();
        if (val === '') {
            this.app.message.alert('选项名称不能为空');
        } else {
            this.module.dispatch('updateName', { id: id, name: val, explain: explain });
        }
    },
    updateExplain: function(id) {
        var val = $(this.$('input-explain-' + id)).val();
        this.module.dispatch('updateExplain', { id: id, explain: val });
    },
    delOption: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此选项吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('delOption', id);
            }, function() {
                resolve(false);
            });
        });
    },
    addOption: function() {
        var bus = this.bindings.bus.data;
        var name = $(this.$('name')).val();
        var startTime = $(this.$('startTime')).val();
        var endTime = $(this.$('endTime')).val();
        var classId = this.bindings.state.data.classId;
        bus.name = name;
        bus.startTime = startTime;
        bus.endTime = endTime;
        bus.classId = classId;
        this.module.dispatch('addOption', '选项名称');
    }
};

exports.actions = {
    'click saveOption': 'saveOption',
    'click delOption*': 'delOption',
};

exports.dataForActions = {
    saveOption: function() {
        var bus = this.bindings.bus.data;
        var name = $(this.$('name')).val();
        var startTime = $(this.$('startTime')).val();
        var endTime = $(this.$('endTime')).val();
        bus.name = name;
        bus.startTime = startTime;
        bus.endTime = endTime;
    }
};

exports.actionCallbacks = {
};
