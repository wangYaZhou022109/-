var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

// exports.type = 'form';

exports.bindings = {
    popupCurrent: true
};

exports.events = {
    'click cancel': 'cancel',
};

exports.handlers = {
    cancel: function() {
        $(this.$('setting-popup')).removeClass('show');
        return this.module.dispatch('clearCurrent');
    }
};

exports.actions = {
    'click save-tactic': 'saveTactic'
};

exports.dataForActions = {
    saveTactic: function(data) {
        return this.validate() ? data : false;
    }
};

exports.actionCallbacks = {
    saveTactic: function() {
        $(this.$('setting-popup')).removeClass('show');
    }
};

exports.afterRender = function() {
    if (this.bindings.popupCurrent.data.title) {
        $(this.$('setting-popup')).addClass('show');
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
        var popupAmount = $(this.$('popupAmount')),
            popupScore = $(this.$('popupScore')),
            flag = true,
            useableAmount = this.bindings.popupCurrent.data.useableAmount;

        markers.text.valid(popupAmount);
        markers.text.valid(popupScore);

        if (popupScore.val() === '') {
            markers.text.invalid(popupScore, validators.required.message);
            flag = false;
        }

        if (validators.number.fn(popupScore.val()) && this.interval.fn(popupScore.val(), 0, 1, 1000, 1) &&
        !this.keepDecimal.fn(popupScore.val(), 0)) {
            markers.text.invalid(popupScore, this.keepDecimal.message);
            flag = false;
        }

        if (validators.number.fn(popupScore.val()) && !this.interval.fn(popupScore.val(), 0, 1, 1000, 1)) {
            markers.text.invalid(popupScore, '必须在 0 ~ 1000 之间');
            flag = false;
        }

        if (!validators.number.fn(popupScore.val())) {
            markers.text.invalid(popupScore, '只能填写数字，必须在 0 ~ 1000 之间');
            flag = false;
        }

        if (popupAmount.val() === '') {
            markers.text.invalid(popupAmount, validators.required.message);
            flag = false;
        }

        if (validators.number.fn(popupAmount.val()) && validators.range.fn(popupAmount.val(), 0, useableAmount) &&
        !this.keepDecimal.fn(popupAmount.val(), 0)) {
            markers.text.invalid(popupAmount, this.keepDecimal.message);
            flag = false;
        }

        if (validators.number.fn(popupAmount.val()) && !validators.range.fn(popupAmount.val(), 0, useableAmount)) {
            markers.text.invalid(popupAmount, '必须在 0 ~ ' + useableAmount + ' 之间');
            flag = false;
        }

        if (!validators.number.fn(popupAmount.val())) {
            markers.text.invalid(popupAmount, '只能填写数字，必须在 0 ~ ' + useableAmount + ' 之间');
            flag = false;
        }
        return flag;
    }
};
