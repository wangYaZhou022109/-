var _ = require('lodash/collection'),
    $ = require('jquery'),
    D = require('drizzlejs'),
    setError,
    clearError,
    checkChinese;

exports.bindings = {
    state: true,
    answer: true
};

exports.dataForTemplate = {
    options: function(d) {
        _.map(d.state.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
        });
        return d.state.options;
    },
    answer: function() {
        var answer = this.bindings.answer,
            options = this.bindings.state.data.options,
            str = '';
        if (answer.data.value.length > 0) {
            str = answer.data.value[0].value;
            _.forEach(options, function(o) {
                str = str.replace(o.name + '|', o.code);
            });
        }
        return str;
    },
    isShowDetail: function() {
        var mode = this.bindings.state.data.detailMode;
        return mode && mode > 0 && mode < 4;
    },
    state: function(data) {
        return D.assign(data.state, {
            errorRate: data.state.errorRate / 10000
        });
    },
    isDisabled: function(data) {
        var mode = data.state.detailMode;
        return mode && mode > 0;
    }
};

exports.events = {
    'change answer': 'changeAnswer',
    'keypress answer': 'keypressAnswer'
};

exports.handlers = {
    changeAnswer: function() {
        var answer = this.bindings.answer,
            options = this.bindings.state.data.options,
            data = this.$('answer').value.toLocaleUpperCase(),
            result = data,
            i,
            option;

        if (!checkChinese.call(this, result)) {
            return false;
        }

        for (i = 0; i < data.length; i++) {
            option = _.find(options, ['code', data.charAt(i)]);
            result = result.replace(data.charAt(i), option.name + '|');
        }

        answer.set({
            key: this.bindings.state.data.id,
            value: [{
                id: this.bindings.state.data.id,
                value: result
            }]
        });
        return this.module.dispatch('save');
    },
    keypressAnswer: function(e) {
        var k = e.keyCode,
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
                setError.call(this, '有重复的字母顺序');
                e.preventDefault();
                return false;
            }
            clearError();
            return true;
        }

        setError.call(this, '仅支持字母顺序');
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

exports.beforeRender = function() {
    var data = this.bindings.state.data;
    if (data.detailMode === 1) {
        data.isShowAnswer = true;
        data.isShowGainScore = true;
    }
    if (data.detailMode === 2) {
        data.isShowAnswer = false;
        data.isShowGainScore = true;
    } else if (data.detailMode === 3) {
        data.isShowAnswer = false;
        data.isShowGainScore = true;
        this.bindings.answer.data = {};
    }
};

