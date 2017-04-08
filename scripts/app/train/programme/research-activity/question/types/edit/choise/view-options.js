var _ = require('lodash/collection'),
    $ = require('jquery'),
    validator = require('./app/ext/views/form/validators'),
    OPTION_SCORE = 1;

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
                    score: state.mode === OPTION_SCORE ? $(this.$('score-' + i)).val() : 0
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
    checkScore: function(value) {
        if (!validator.number.fn(value)) {
            this.app.message.error('分数' + validator.number.message);
            return false;
        }

        if (!validator.interval.fn(value, 0, 1, 10, 0)) {
            this.app.message.error('分数范围0~10分');
            return false;
        }

        return true;
    }
};
