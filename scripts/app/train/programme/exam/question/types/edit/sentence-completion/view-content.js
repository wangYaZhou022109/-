var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

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
    },
    validate: function() {
        var content = $(this.$('content')),
            components = this.components.content.text(),
            answer = $(this.$('answer')),
            flag = true;

        markers.text.valid(content);
        markers.text.valid(answer);

        if (components.trim() === '') {
            markers.text.invalid(content, validators.required.message);
            flag = false;
        }

        if (!validators.maxLength.fn(components, 3000)) {
            markers.text.invalid(content, '最大长度为3000');
            flag = false;
        }
        if (!answer.val()) {
            markers.text.invalid(answer, validators.required.message);
            flag = false;
        }

        return flag;
    }
};
