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
    validate: function() {
        var content = $(this.$('content')),
            difficulty = $(this.$('difficulty')),
            components = this.components.content.text(),
            flag = true;

        markers.text.valid(content);
        markers.text.valid(difficulty);

        if (components.trim() === '') {
            markers.text.invalid(content, validators.required.message);
            flag = false;
        }

        if (!validators.maxLength.fn(components, 3000)) {
            markers.text.invalid(content, '最大长度为3000');
        }

        if (difficulty.val() === '') {
            markers.text.invalid(difficulty, validators.required.message);
            flag = false;
        }
        return flag;
    }
};
