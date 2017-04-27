var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    maps = require('./app/util/maps'),
    _ = require('lodash/collection');

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
}, {
    id: 'difficulty',
    name: 'selectize'
}];

exports.dataForTemplate = {
    showDiffculty: function() {
        return this.module.renderOptions.editMode === 2;
    },
    difficultys: function(data) {
        var difficultys = maps.get('question-difficultys');
        if (data.state) {
            _.map(difficultys, function(t) {
                var obj = t;
                if (Number(obj.key) === data.state.difficulty) {
                    obj.selected = true;
                }
            });
        }
        return difficultys;
    }
};

exports.mixin = {
    validate: function() {
        var content = $(this.$('content')),
            components = this.components.content.html(),
            flag = true;
        markers.text.valid(content);

        if (components === '' || components === null) {
            markers.text.invalid(content, validators.required.message);
            flag = false;
        }

        return flag;
    }
};
