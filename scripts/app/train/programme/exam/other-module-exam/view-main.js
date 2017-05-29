var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
// exports.type = 'form';

exports.bindings = {
    exam: true
};

exports.events = {
    'change name': 'changeName',
    'change paperShowRule': 'changePaperShowRule',
    'change endTime': 'changeTime'
};

exports.handlers = {
    changeName: function() {
        return this.module.dispatch('changeName', { name: this.$('name').value });
    },
    changePaperShowRule: function() {
        return this.module.dispatch('changeName', { paperShowRule: $(this.$$('[name="paperShowRule"]')).val() });
    },
    changeTime: function() {
        var startTime = $(this.$('startTime')).val(),
            endTime = $(this.$('endTime')).val();
        if (endTime !== '' || endTime !== null) {
            if (startTime !== '' && startTime !== null) {
                if (startTime >= endTime) {
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

exports.dataForTemplate = {
    paperShowRule: function(data) {
        return {
            single: data.exam.paperShowRule === 1,
            mutiple: data.exam.paperShowRule === 2,
        };
    },
    showTimeRange: function() {
        return this.module.renderOptions.showTimeRange === 1;
    },
    isOverByPassExam: function(data) {
        var no;
        if (!data.exam.isOverByPassExam || data.exam.isOverByPassExam === 0) {
            no = true;
        }
        return {
            yes: data.exam.isOverByPassExam === 1,
            no: no
        };
    }
};

exports.mixin = {
    check: function() {
        var startTime = this.$('startTime') && this.$('startTime').value,
            endTime = this.$('endTime') && this.$('endTime').value;

        if ((startTime && !endTime) || (!startTime && endTime)) {
            this.app.message.error('必须完整填写考试时间范围或者全部不填');
            return false;
        }
        return true;
    },
    validate: function() {
        var name = $(this.$('name')),
            duration = $(this.$('duration')),
            passScore = $(this.$('passScore')),
            paperShowRule = $(this.$('paperShowRule')),
            isOverByPassExam = $(this.$$('[name="isOverByPassExam"]:checked')).val(),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g'),
            isExam = $(this.$('is-over-by-pass-exam'));

        markers.text.valid(name);
        markers.text.valid(duration);
        markers.text.valid(passScore);
        markers.text.valid(paperShowRule);
        markers.text.valid(isExam);
        if (name.val() !== '' && !validators.maxLength.fn(name.val(), 30)) {
            markers.text.invalid(name, validators.maxLength.message.replace(reg, 30));
            flag = false;
        }

        if (trim(name.val()) === '' || trim(name.val()) === null) {
            markers.text.invalid(name, validators.required.message);
            flag = false;
        }

        if (duration.val() === '' || duration.val() === null) {
            markers.text.invalid(duration, validators.required.message);
            flag = false;
        }
        if (duration.val() !== '') {
            if (validators.number.fn(duration.val()) && validators.range.fn(duration.val(), 1, 500) &&
            !this.keepDecimal.fn(duration.val(), 0)) {
                markers.text.invalid(duration, this.keepDecimal.message);
                flag = false;
            }
            if (validators.number.fn(duration.val()) && !validators.range.fn(duration.val(), 1, 500)) {
                markers.text.invalid(duration, '必须在1~500之间');
                flag = false;
            }
            if (!validators.number.fn(duration.val())) {
                markers.text.invalid(duration, validators.number.message);
                flag = false;
            }
        }
        if (passScore.val() === '' || passScore.val() === null) {
            markers.text.invalid(passScore, validators.required.message);
            flag = false;
        }
        if (passScore.val() !== '') {
            if (validators.number.fn(passScore.val()) && validators.range.fn(passScore.val(), 0, 1000) &&
            !this.keepDecimal.fn(passScore.val(), 0)) {
                markers.text.invalid(passScore, this.keepDecimal.message);
                flag = false;
            }
            if (validators.number.fn(passScore.val()) && !validators.range.fn(passScore.val(), 0, 1000)) {
                markers.text.invalid(passScore, '必须在0~1000之间');
                flag = false;
            }
            if (!validators.number.fn(passScore.val())) {
                markers.text.invalid(passScore, validators.number.message);
                flag = false;
            }
        }

        if (isOverByPassExam === undefined) {
            markers.text.invalid(isExam, validators.required.message);
            flag = false;
        }
        return flag;
    },
    keepDecimal: {
        fn: function(value, n) {
            var v;
            if (trim(value) === '') return true;
            v = value.toString().split('.');
            if (v.length > 1) return v[1].length <= n;
            return true;
        },
        length: 1,
        message: '超出保留小数位'
    }
};
