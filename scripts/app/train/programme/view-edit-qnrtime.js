var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
// exports.type = 'form';

exports.title = '编辑时间';

exports.bindings = {
    state: true,
    research: true
};

exports.buttons = [{
    text: '保存',
    action: 'editTime'
}];

exports.events = {
    'change endTime': 'changeInfo',
    'change startTime': 'changeInfo'
};

exports.handlers = {
    changeInfo: function() {
        var start = $(this.$('startTime')).val(),
            end = $(this.$('endTime')).val();
        if (end !== '' && end !== null) {
            if (start !== '' && start !== null) {
                if (start >= end) {
                    this.app.message.alert('结束时间不能早于开始时间');
                    $(this.$('endTime')).val('');
                }
            } else {
                this.app.message.alert('请先填写开始时间');
                $(this.$('endTime')).val('');
            }
        }
    }
};

exports.dataForActions = {
    editTime: function(payload) {
        return this.validate() ? payload : false;
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

exports.mixin = {
    validate: function() {
        var start = $(this.$('startTime')),
            end = $(this.$('endTime')),
            flag = true;

        markers.text.valid(start);
        markers.text.valid(end);

        if (start.val() === '' || start.val() === null) {
            markers.text.invalid(start, validators.required.message);
            flag = false;
        }
        if (end.val() === '' || end.val() === null) {
            markers.text.invalid(end, validators.required.message);
            flag = false;
        }
        return flag;
    }
};
