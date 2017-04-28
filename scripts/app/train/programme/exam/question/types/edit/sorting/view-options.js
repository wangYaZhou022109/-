var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    state: true
};

exports.type = 'dynamic';

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

exports.mixin = {
    checkAnswer: function(options) {
        var me = this,
            scoreItem = this.module.items.score,
            n = 0,
            answer = scoreItem.$('answer').value.toLocaleUpperCase();
        if (this.checkEmptyOption()) {
            this.app.message.error('存在空选项');
            return false;
        }
        _.forEach(options, function(ii, i) {
            if ($(me.$('content-' + i)).val() !== '') n++;
        });
        return n === answer.length;
    },
    getResult: function(options) {
        var result = [],
            i,
            value,
            contentItem = this.module.items.content,
            scoreItem = this.module.items.score,
            answer = scoreItem.$('answer').value.toLocaleUpperCase(),
            answerReplace = answer,
            code,
            data = {};

        for (i = 0; i < options.length; i++) {
            value = $(this.$('content-' + i)).val();
            if (value !== '') {
                result.push({ value: value, name: i, type: 8 });
            }
        }

        for (i = 0; i < answer.length; i++) {
            code = answer.charAt(i);
            answerReplace = answerReplace.replace(
                code,
                options[(code.charCodeAt(0) - 'A'.charCodeAt(0))].name + '|'
            );
        }
        result.push({ value: answerReplace, name: 0, type: 0 });
        data.questionAttrs = result;
        data.content = contentItem.components.content.html();
        data.score = scoreItem.$('score').value;
        data.id = this.bindings.state.data.id;
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
            el,
            isEmpty = false;
        if (options) {
            for (i; i < options.length; i++) {
                el = this.$('content-' + i);
                if (el.value === '') {
                    isEmpty = true;
                    $(el).parent().addClass('input error');
                } else {
                    $(el).parent().removeClass('input error');
                }
            }
        }
        return isEmpty;
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
