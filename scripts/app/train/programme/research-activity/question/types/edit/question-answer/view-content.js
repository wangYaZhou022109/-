var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
// exports.type = 'form';

exports.bindings = {
    img: true,
    state: false
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}];

exports.mixin = {
    getResult: function() {
        var data = {},
            state = this.bindings.state.data;
        data.questionAttrs = [{ value: '', name: '', type: 5 }];
        data.content = this.components.content.html();
        data.type = state.type;
        data.id = state.id;
        return data;
    },
    validate: function() {
        var content = $(this.$('content')),
            components = this.components.content.text(),
            flag = true;
        markers.text.valid(content);
        if (components.trim() === '' || components.trim() === null) {
            markers.text.invalid(content, validators.required.message);
            flag = false;
        }

        return flag;
    }
};

