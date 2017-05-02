var markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    $ = require('jquery');

exports.type = 'dynamic';

exports.bindings = {
    retest: true,
    exam: true,
    state: true
};

exports.components = [
    {
        id: 'start-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    },
    {
        id: 'end-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    }
];

exports.getEntity = function() {
    return this.bindings.retest.data.members;
};

exports.getEntityModuleName = function() {
    return 'exam/exam/manage/retest/retest-members';
};

exports.dataForEntityModule = function(members) {
    var me = this;
    return {
        data: members,
        callback: function(data) {
            me.bindings.retest.addMember(data);
        },
        latestExamId: this.bindings.state.data.latestExamId
    };
};

exports.mixin = {
    validate: function() {
        var startTime = $(this.$('start-time')),
            endTime = $(this.$('end-time')),
            duration = $(this.$('duration')),
            text,
            flag = true;

        markers.text.valid(startTime);
        markers.text.valid(endTime);
        markers.text.valid(duration);

        if (!validators.required.fn(startTime.val())) {
            markers.text.invalid(startTime, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(endTime.val())) {
            markers.text.invalid(endTime, validators.required.message);
            flag = false;
        }

        if (!validators.required.fn(duration.val())) {
            text += validators.required.message + ',';
            flag = false;
        }
        if (!validators.number.fn(duration.val())) {
            text += validators.number.message + ',';
            flag = false;
        }
        if (!validators.keepDecimal.fn(duration.val(), 0)) {
            text += validators.keepDecimal.message + ',';
            flag = false;
        }
        if (!validators.range.fn(duration.val(), 0, 500)) {
            text += validators.range.message + ',';
            flag = false;
        }
        if (text) {
            markers.text.invalid(duration, text);
        }

        if (!this.getEntities()[0].validate()) {
            this.app.message.error('请选择补考人员');
            flag = false;
        }

        return flag;
    }
};
