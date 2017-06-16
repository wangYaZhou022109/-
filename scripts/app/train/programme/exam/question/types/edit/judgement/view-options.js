var $ = require('jquery');

exports.bindings = {
    state: true
};

exports.mixin = {
    checkAnswer: function() {
        return $(this.$$('[name="judge"]:checked')).val();
    },
    getResult: function() {
        var value = $(this.$$('[name="judge"]:checked')).val(),
            data = {},
            contentItem = this.module.items.content,
            scoreItem = this.module.items.score,
            state = this.bindings.state.data;

        data.content = contentItem.components.content.html();
        data.contentText = contentItem.components.content.text();
        data.questionAttrs = [{ value: value, name: value, type: 3 }];
        data.score = scoreItem.$('score').value;
        data.id = state.id;
        data.type = state.type;
        return data;
    }
};
