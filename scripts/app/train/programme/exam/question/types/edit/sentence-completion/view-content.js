var $ = require('jquery');

// exports.type = 'form';

exports.bindings = {
    img: true,
    state: true
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}];

exports.mixin = {
    checkAnswer: function() {
        var values = $(this.$('answer')).val().split('|'),
            content = this.components.content.html(),
            state = this.module.store.models.state;
        if (values.length !== state.patch('\\(\\)', content)) {
            this.app.message.error('试题中的()括号数必须与答案数一致');
            return false;
        }
        return true;
    },
    getResult: function() {
        var values = $(this.$('answer')).val().split('|'),
            data = {},
            result = values.join('|'),
            score = this.module.items.score;
        data.questionAttrs = [{ value: result, name: result, type: 4 }];
        data.content = this.components.content.html();
        data.score = score.$('score').value;
        data.id = this.bindings.state.data.id;
        return data;
    }
};
