var $ = require('jquery'),
    _ = require('lodash/collection'),
    setError,
    clearError,
    checkChinese,
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

// exports.type = 'form';

exports.bindings = {
    state: true
};

exports.events = {
    'change answer': 'changeAnswer',
    'keypress answer': 'keypressAnswer'
};

exports.handlers = {
    changeAnswer: function() {
        var data = this.$('answer').value.toLocaleUpperCase(),
            result = data;

        clearError.call(this);
        if (!checkChinese.call(this, result)) {
            return false;
        }
        return true;
    },
    keypressAnswer: function(e) {
        var k = e.keyCode || e.charCode || e.which,
            char = String.fromCharCode(k).toLocaleUpperCase(),
            answer = this.$('answer').value,
            isRepeat = function(o, n) {
                if (o) {
                    return !_.every(o, function(b) {
                        return b !== n;
                    });
                }
                return true;
            };
        if (k >= 65 && k <= 122 && _.find(this.bindings.state.data.options, ['code', char])) {
            if (answer.length > 0 && isRepeat(answer.toLocaleUpperCase(), char)) {
                setError.call(this, '出现重复字母');
                e.preventDefault();
                return false;
            }
            clearError();
            return true;
        }

        setError.call(this, '输入字母超出范围');
        e.preventDefault();
        return false;
    }
};

setError = function(msg) {
    $(this.$('error')).html('<span class="error-text">' + msg + '</span>');
    $(this.$('answer')).addClass('error');
};

clearError = function() {
    $(this.$('error')).html('');
    $(this.$('answer')).removeClass('error');
};

checkChinese = function(result) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(result)) {
        setError.call(this, '非法输入');
        this.$('answer').value = '';
        return false;
    }
    return true;
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
