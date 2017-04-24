var $ = require('jquery'),
    _ = require('lodash/collection'),
    setError,
    clearError,
    checkChinese;

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
