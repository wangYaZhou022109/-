var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

exports.ADD_QUESTIONARY = 'train/programme/research-activity/add-research-activity/steps/step-2';

exports.bindings = {
    research: true,
    time: false
};

exports.type = 'dynamic';

exports.events = {
    'change name': 'changeInfo',
    'change start-time': 'changeTime',
    'change end-time': 'changeTime',
    'change questionaryDetail': 'changeInfo'
};

exports.handlers = {
    changeInfo: function() {
        return this.module.dispatch('changeInfoDetaile', this.getData());
    },
    changeTime: function() {
        var start = $(this.$('start-time')).val(),
            end = $(this.$('end-time')).val();
        if (end !== '' && end !== null) {
            if (start !== '' && start !== null) {
                if (start >= end) {
                    this.app.message.alert('结束时间不能早于开始时间');
                    $(this.$('end-time')).val('');
                }
            } else {
                this.app.message.alert('请先填写开始时间');
                $(this.$('end-time')).val('');
            }
        }
        return this.module.dispatch('changeInfoDetaile', this.getData());
    }
};

exports.components = [{
    id: 'start-time',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'end-time',
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
            startTime: this.$('start-time').value,
            endTime: this.$('end-time').value,
            questionaryDetail: $(this.$('questionaryDetail')).val().trim()
        };
    },
    validate: function() {
        var name = $(this.$('name')),
            start = $(this.$('start-time')),
            end = $(this.$('end-time')),
            startTime = $(this.$('start')),
            questionaryDetail = $(this.$('questionaryDetail')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(name);
        markers.text.valid(startTime);
        markers.text.valid(end);
        markers.text.valid(questionaryDetail);

        if (name.val().trim() === '' || name.val().trim() === null) {
            markers.text.invalid(name, validators.required.message);
            flag = false;
        }

        if (start.val() === '' || start.val() === null) {
            markers.text.invalid(startTime, validators.required.message);
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
        if (name.val().trim() !== '' && !validators.maxLength.fn(name.val(), 30)) {
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

