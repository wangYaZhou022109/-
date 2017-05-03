var maps = require('./app/util/maps'),
    $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

// exports.type = 'form';

exports.bindings = {
    img: true,
    state: false
};

exports.events = {
    'click add-question-*': 'addQuestion'
};

exports.handlers = {
    addQuestion: function(type) {
        var opt = { type: type },
            view = this.module.items.modal;
        opt.title = maps.get('question-types')[Number(opt.type) - 1].value;
        opt.multiple = Number(opt.type) === 2;
        opt.editMode = 2;
        this.app.viewport.modal(view, opt);
    }
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
            components = this.components.content.html(),
            flag = true;

        markers.text.valid(content);

        if (components === '') {
            markers.text.invalid(content, validators.required.message);
            flag = false;
        }

        if (!validators.maxLength.fn(components, 3000)) {
            markers.text.invalid(content, '最大长度为3000');
        }

        return flag;
    }
};
