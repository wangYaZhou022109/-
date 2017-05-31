var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};
var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
// exports.type = 'form';

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    showScore: function() {
        return !this.module.renderOptions.hideScore;
    }
};

exports.mixin = {
    interval: {
        fn: function(value, min, minInclude, max, maxInclude) {
            var v;
            if (!value) return true;
            v = Number(value);
            if (minInclude === '1' && maxInclude === '1') return v >= min && v <= max;
            if (minInclude === '1' && maxInclude !== '1') return v >= min && v < max;
            if (minInclude !== '1' && maxInclude === '1') return v > min && v <= max;
            if (minInclude !== '1' && maxInclude !== '1') return v > min && v < max;
            return true;
        },
        length: 4,
        message: '必须在 {0} ~ {2} 之间'
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
    },
    validate: function() {
        var score = $(this.$('score')),
            flag = true;

        markers.text.valid(score);

        if (score.val() === '') {
            markers.text.invalid(score, validators.required.message);
            flag = false;
        }

        if (validators.number.fn(score.val()) && this.interval.fn(score.val(), 0, 1, 100, 1) &&
        !this.keepDecimal.fn(score.val(), 1)) {
            markers.text.invalid(score, this.keepDecimal.message);
            flag = false;
        }

        if (validators.number.fn(score.val()) && !this.interval.fn(score.val(), 0, 1, 100, 1)) {
            markers.text.invalid(score, '必须在 0 ~ 100 之间');
            flag = false;
        }

        if (!validators.number.fn(score.val())) {
            markers.text.invalid(score, '只能填写数字，必须在 0 ~ 100 之间');
            flag = false;
        }
        return flag;
    }
};
