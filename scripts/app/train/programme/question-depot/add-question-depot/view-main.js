var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');
// exports.type = 'form';

exports.bindings = {
    questionDepot: true,
    state: false
};

exports.components = [function() {
    var questionDepot = this.bindings.questionDepot.data,
        obj = {
            id: 'question-depot',
            name: 'picker',
            options: {
                picker: 'question-depot',
                required: false,
                inputName: 'parentId',
                params: {
                    operatorType: this.app.global.EDIT,
                    organizationId: this.bindings.state.data.organizationId
                },
                data: {}
            }
        };
    if (questionDepot.parentName) {
        obj.options.data.id = questionDepot.parentId;
        obj.options.data.name = questionDepot.parentName;
    }
    return obj;
}];
// }, {
//     id: 'state',
//     name: 'radiox'
// }, {
//     id: 'auto-to-lower',
//     name: 'radiox'
// }];
exports.mixin = {
    validate: function() {
        var name = $(this.$('name')),
            // startTime = $(this.$('startTime')),
            // endTime = $(this.$('endTime')),
            code = $(this.$('code')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(name);
        markers.text.valid(code);
        if (name.val() !== '' && !validators.maxLength.fn(name.val(), 10)) {
            markers.text.invalid(name, validators.maxLength.message.replace(reg, 10));
            flag = false;
        }

        if (name.val().trim() === '' || name.val().trim() === null) {
            markers.text.invalid(name, validators.required.message);
            flag = false;
        }

        if (code.val().trim() === '' || code.val().trim() === null) {
            markers.text.invalid(code, validators.required.message);
            flag = false;
        }

        if (code.val() !== '' && !validators.maxLength.fn(code.val(), 20)) {
            markers.text.invalid(code, validators.maxLength.message.replace(reg, 20));
            flag = false;
        }
        return flag;
    }
};
