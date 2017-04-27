var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');

exports.title = '班车/订餐信息发布';

exports.bindings = {
    buss: true,
    bus: true,
    optionList: true,
    state: false,
};

exports.buttons = [{
    text: '添加',
    action: 'saveOption',
}];

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
        var classId = this.bindings.state.data.classId;
        var optionList = this.bindings.optionList;
        bus.name = name;
        bus.startTime = startTime;
        bus.endTime = endTime;
        bus.classId = classId;
        if (!validators.required.fn(name)) {
            this.app.message.error('名称必填');
            return false;
        }
        if (!validators.required.fn(startTime)) {
            this.app.message.error('开始时间必填');
            return false;
        }
        if (!validators.required.fn(endTime)) {
            this.app.message.error('结束时间必填');
            return false;
        }
        if (startTime >= endTime) {
            this.app.message.alert('结束时间必须大于开始时间');
            return false;
        } else if (startTime < endTime) {
            if (optionList.data.length > 6) {
                this.app.message.alert('一条统计主题最多只能发布六个选项');
                return false;
            } else if (optionList.data.length < 1) {
                this.app.message.alert('一条统计主题至少需要一个选项');
                return false;
            }
        }
        return true;
    }
};

exports.actionCallbacks = {
};

exports.components = [{
    id: 'startTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'endTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}];
