var _ = require('lodash/collection'),
    $ = require('jquery');

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
    'change content-*': 'changeContent',
};

exports.dataForActions = {
    changeContent: function(data) {
        var d = data;
        d.content = this.$('content-' + data.index).value;
        return d;
    }
};

exports.mixin = {
    checkAnswer: function(options) {
        var i;
        for (i = 0; i < options.length; i++) {
            if ($(this.$('content-' + i)).val() === '' && $(this.$('match-' + i)).val() !== '') {
                return false;
            }
            if ($(this.$('content-' + i)).val() !== '' && $(this.$('match-' + i)).val() === '') {
                return false;
            }
        }
        return true;
    },
    getResult: function(options) {
        var result = [],
            i,
            name,
            value,
            data = {},
            contentItem = this.module.items.content,
            scoreItem = this.module.items.score,
            state = this.bindings.state.data;

        for (i = 0; i < options.length; i++) {
            name = $(this.$('content-' + i)).val();
            value = $(this.$('match-' + i)).val();
            if (name !== '' && value !== '') {
                result.push({ value: value, name: name, type: 7 });
            }
        }
        data.questionAttrs = result;
        data.content = contentItem.components.content.html();
        data.score = scoreItem.$('score').value;
        data.type = state.type;
        data.id = state.id;
        return data;
    }
};
