var _ = require('lodash/collection'),
    $ = require('jquery'),
    validator = require('./app/ext/views/form/validators'),
    D = require('drizzlejs'),
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
    'click remove-*': 'removeOption'
};

exports.dataForActions = {
    addOption: function(payload) {
        this.setResult();
        return payload;
    },
    removeOption: function(payload) {
        this.setResult();
        return payload;
    }
};

exports.getEntity = function(id) {
    return id;
};

exports.getEntityModuleName = function() {
    return 'exam/question/senior-editor';
};

exports.dataForEntityModule = function(data) {
    var me = this,
        state = me.bindings.state;
    return {
        data: {
            id: data,
            value: state.data.options[data].content
        },
        callback: function(i, content, text) {
            me.changeOptionContent(i, content, text);
        },
        getValue: function() {
            return $(me.$('content-' + data)).val();
        }
    };
};

exports.mixin = {
    checkAnswer: function() {
        if (this.checkEmptyOption()) {
            return false;
        }
        if (this.checkMaxLengthOption()) {
            return false;
        }
        return true;
    },
    setResult: function() { // 将页面文本编辑器的数据保存进options
        var result = [],
            i,
            content,
            state = this.bindings.state.data;

        for (i = 0; i < state.options.length; i++) {
            content = $(this.$('content-' + i)).val();
            result.push(D.assign(state.options[i], {
                content: content,
                score: state.mode === OPTION_SCORE ? $(this.$('score-' + i)).val() : 0
            }));
        }
        state.options = result;
    },
    getResult: function() { // 将options的值组装成question
        var result = [],
            data = {},
            i,
            value,
            view = this.module.items.content,
            state = this.bindings.state.data,
            options = state.options;

        this.setResult();
        for (i = 0; i < options.length; i++) {
            value = $(this.$('content-' + i)).val();
            result.push({
                value: value,
                valueText: options[i].contentText || value,
                name: i,
                type: state.multiple ? 2 : 1,
                score: state.mode === OPTION_SCORE ? ($(this.$('score-' + i)).val() * 100) : 0
            });
        }
        data.questionAttrs = result;
        data.content = view.components.content.html();
        data.contentText = view.components.content.text();
        if (this.module.renderOptions.editMode === 2) {
            data.difficulty = view.$('difficulty').value;
        }
        data.id = state.id;
        return data;
    },
    changeOptionContent: function(index, content, text) {
        var isRichText = this.bindings.state.isRichText(content);
        this.setResult();
        this.bindings.state.data.options[index].content = content;
        this.bindings.state.data.options[index].contentText = text;
        this.bindings.state.data.options[index].isRichText = isRichText;
        this.bindings.state.changed();
    },
    checkEmptyOption: function() {
        var options = this.bindings.state.data.options,
            i = 0,
            contentEl,
            scoreEl,
            code,
            isEmpty = false,
            state = this.bindings.state.data;

        if (options) {
            for (i; i < options.length; i++) {
                code = String.fromCharCode(i + 'A'.charCodeAt(0));
                contentEl = this.$('content-' + i);
                if (contentEl.value === '') {
                    isEmpty = true;
                    $(contentEl).addClass('error');
                    this.app.message.error('选项' + code + '填写不完整');
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
                        if (!this.checkScore(scoreEl.value, code)) {
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
            code,
            isGtMaxLength = false,
            maxLength = 5000;

        if (options) {
            for (i; i < options.length; i++) {
                code = String.fromCharCode(i + 'A'.charCodeAt(0));
                contentEl = this.$('content-' + i);
                if (contentEl.value.length > maxLength) {
                    isGtMaxLength = true;
                    $(contentEl).addClass('error');
                    this.app.message.error('选项' + code + '内容超出最大长度：5000');
                } else {
                    $(contentEl).removeClass('error');
                }
            }
        }
        return isGtMaxLength;
    },
    checkScore: function(value, code) {
        if (!validator.number.fn(value)) {
            this.app.message.error('选项' + code + '分数' + validator.number.message);
            return false;
        }

        if (!validator.interval.fn(value, 0, 1, 9999999.99, 0)) {
            this.app.message.error('选项' + code + '分数范围为0-9999999.99');
            return false;
        }

        if (!validator.keepDecimal.fn(value, 2)) {
            this.app.message.error('选项' + code + '分数最多保留两位小数');
            return false;
        }

        if (new RegExp('^0').test(value)) {
            this.app.message.error('选项' + code + '分数不能以0开头');
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
