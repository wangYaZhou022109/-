var _ = require('lodash/collection'),
    $ = require('jquery'),
    V = require('./app/ext/views/form/validators'),
    OPTION_MAX_LENGTH = 1000;

exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    options: function(d) {
        _.map(d.state.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
        });
        return d.state.options;
    }
};

exports.actions = {
    'click add': 'addOption',
    'click remove-*': 'removeOption',
    'click is-answer-*': 'changeAnswer',
    'change content-*': 'changeContent'
};

exports.dataForActions = {
    changeContent: function(data) {
        var d = data;
        d.content = this.$('content-' + data.index).value;
        this.validateOption();
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
    checkAnswer: function(options) {
        var answers,
            state = this.bindings.state.data;

        if (!this.validateOption()) {
            return false;
        }

        answers = _.filter(options, function(o) {
            return o.isAnswer;
        });

        if (state.multiple && answers.length < 2) {
            this.app.message.error('必须选择两个以上选项作为答案');
            return false;
        }

        if (!state.multiple && answers.length < 1) {
            this.app.message.error('必须选择一个选项作为答案');
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
            score = this.module.items.score,
            state = this.bindings.state.data;

        for (i = 0; i < options.length; i++) {
            value = $(this.$('content-' + i)).val();
            if (!value) {
                value = options[i].content;
            }
            if (value !== '') {
                if (options[i].isAnswer) {
                    result.push({ value: value, name: i, type: 0 });
                } else {
                    result.push({ value: value, name: i, type: state.multiple ? 2 : 1 });
                }
            }
        }
        data.questionAttrs = result;
        data.content = view.components.content.html();
        data.contentText = view.components.content.text();
        if (this.module.renderOptions.editMode === 2) {
            data.difficulty = view.$('difficulty').value;
        }
        if (!this.module.renderOptions.hideScore) {
            data.score = score.$('score').value;
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
    validateOption: function() {
        var options = this.bindings.state.data.options,
            i = 0,
            el,
            validate = true,
            checkOption = function(e) {
                $(e).parent('.input-box').removeClass('input error');

                if (!V.required.fn(e.value)) {
                    $(e).parent('.input-box').addClass('input error');
                    return false;
                }

                if (!V.maxLength.fn(e.value, OPTION_MAX_LENGTH)) {
                    this.app.message.error('选项最大长度;' + OPTION_MAX_LENGTH);
                    $(e).parent('.input-box').addClass('input error');
                    return false;
                }
                return true;
            };
        if (options) {
            for (i; i < options.length; i++) {
                el = this.$('content-' + i);
                validate = checkOption.call(this, el);
                if (!validate) break;
            }
        }
        return validate;
    }
};
