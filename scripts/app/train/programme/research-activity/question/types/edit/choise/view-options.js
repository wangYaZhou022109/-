var _ = require('lodash/collection'),
    $ = require('jquery'),
    validator = require('./app/ext/views/form/validators'),
    OPTION_SCORE = 1,
    trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    options: function(d) {
        var me = this;
        _.map(d.state.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
            item.mode = me.bindings.state.data.mode;
        });
        return d.state.options;
    }
};

exports.actions = {
    'click add': 'addOption',
    'click remove-*': 'removeOption',
    'change content-*': 'changeContent'
};

exports.dataForActions = {
    changeContent: function(data) {
        var d = data;
        d.content = this.$('content-' + data.index).value;
        this.checkEmptyOption();
        return d;
    }
};

exports.getEntity = function(id) {
    return id;
};

exports.getEntityModuleName = function() {
    return 'train/programme/exam/question/senior-editor';
};

exports.dataForEntityModule = function(data) {
    var me = this,
        state = me.bindings.state;
    return {
        data: {
            id: data,
            value: state.data.options[data].content
        },
        callback: function(i, content) {
            me.changeOptionContent(i, content);
        },
        getValue: function() {
            return $(me.$('content-' + data)).val();
        }
    };
};

exports.mixin = {
    checkAnswer: function() {
        if (this.checkEmptyOption()) {
            this.app.message.error('存在选项数据填写不完整');
            return false;
        }
        if (this.checkMaxLengthOption()) {
            this.app.message.error('存在选项内容最大长度为：5000');
            return false;
        }
        return true;
    },
    getResult: function(options) {
        var result = [],
            data = {},
            i,
            value,
            view = this.module.items.content,
            state = this.bindings.state.data;

        for (i = 0; i < options.length; i++) {
            value = $(this.$('content-' + i)).val();
            if (!value) {
                value = options[i].content;
            }
            if (value !== '') {
                result.push({
                    value: value,
                    name: i,
                    type: state.multiple ? 2 : 1,
                    score: state.mode === OPTION_SCORE ? ($(this.$('score-' + i)).val() * 100) : 0
                });
            }
        }
        data.questionAttrs = result;
        data.content = view.components.content.html();
        if (this.module.renderOptions.editMode === 2) {
            data.difficulty = view.$('difficulty').value;
        }
        data.id = state.id;
        return data;
    },
    changeOptionContent: function(index, content) {
        var options = this.bindings.state.data.options,
            data = this.getResult(options),
            isRichText = this.bindings.state.isRichText(content);
        options[index].content = content;
        options[index].isRichText = isRichText;
        return this.module.dispatch('init', { data: data });
    },
    checkEmptyOption: function() {
        var options = this.bindings.state.data.options,
            i = 0,
            contentEl,
            scoreEl,
            isEmpty = false,
            state = this.bindings.state.data;

        if (options) {
            for (i; i < options.length; i++) {
                contentEl = this.$('content-' + i);
                if (contentEl.value === '') {
                    isEmpty = true;
                    $(contentEl).addClass('error');
                } else {
                    $(contentEl).removeClass('error');
                }

                if (state.mode === OPTION_SCORE) {
                    scoreEl = this.$('score-' + i);
                    if (scoreEl && scoreEl.value === '') {
                        isEmpty = true;
                        $(scoreEl).addClass('error');
                    } else {
                        $(scoreEl).removeClass('error');
                        if (!this.checkScore(scoreEl.value)) {
                            isEmpty = true;
                            $(scoreEl).addClass('error');
                        }
                    }
                }
            }
        }
        return isEmpty;
    },
    checkMaxLengthOption: function() {
        var options = this.bindings.state.data.options,
            i = 0,
            contentEl,
            isGtMaxLength = false,
            maxLength = 3000;

        if (options) {
            for (i; i < options.length; i++) {
                contentEl = this.$('content-' + i);
                if (contentEl.value.length > maxLength) {
                    isGtMaxLength = true;
                    $(contentEl).addClass('error');
                } else {
                    $(contentEl).removeClass('error');
                }
            }
        }
        return isGtMaxLength;
    },
    checkScore: function(value) {
        if (!validator.number.fn(value)) {
            this.app.message.error('分数' + validator.number.message);
            return false;
        }

        if (!this.interval.fn(value, 0, 1, 9999999.99, 0)) {
            this.app.message.error('分数范围为0-9999999.99');
            return false;
        }

        if (!this.keepDecimal.fn(value, 2)) {
            this.app.message.error('分数最多保留两位小数');
            return false;
        }

        return true;
    },
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
    }
};
