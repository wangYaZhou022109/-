var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

exports.ADD_QUESTIONARY = 'train/programme/research-activity/add-research-activity/steps/step-2';

exports.bindings = {
    research: true
};

exports.type = 'dynamic';

exports.events = {
    'change name': 'changeInfo',
    'change startTime': 'changeInfo',
    'change endTime': 'changeInfo',
    'change questionaryDetail': 'changeInfo'
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
        return this.module.dispatch('changeInfo', this.getData());
    }
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

exports.getEntity = function() {
    return this.bindings.research.data;
};

exports.getEntityModuleName = function() {
    return this.options.ADD_QUESTIONARY;
};

exports.dataForEntityModule = function(entity) {
    return { research: entity };
};

exports.mixin = {
    getData: function() {
        return {
            name: this.$('name').value,
            startTime: this.$('startTime').value,
            endTime: this.$('endTime').value,
            questionaryDetail: $(this.$('questionaryDetail')).val().trim()
        };
    },
    validate: function() {
        var name = $(this.$('name')),
            start = $(this.$('startTime')),
            end = $(this.$('endTime')),
            questionaryDetail = $(this.$('questionaryDetail')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(name);
        markers.text.valid(start);
        markers.text.valid(end);
        markers.text.valid(questionaryDetail);

        if (name.val() === '' || name.val() === null) {
            markers.text.invalid(name, validators.required.message);
            flag = false;
        }

        if (start.val() === '' || start.val() === null) {
            markers.text.invalid(start, validators.required.message);
            flag = false;
        }
        if (end.val() === '' || end.val() === null) {
            markers.text.invalid(end, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(questionaryDetail.val())) {
            markers.text.invalid(questionaryDetail, validators.required.message);
            flag = false;
        }
        if (name.val() !== '' && !validators.maxLength.fn(name.val(), 30)) {
            markers.text.invalid(name, validators.maxLength.message.replace(reg, 30));
            flag = false;
        }
        if (!validators.maxLength.fn(questionaryDetail.val(), 1000)) {
            markers.text.invalid(questionaryDetail, validators.maxLength.message.replace(reg, 1000));
            flag = false;
        }
        return flag;
    }
};

