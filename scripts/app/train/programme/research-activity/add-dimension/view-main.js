var $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    dimension: true
};

exports.mixin = {
    validate: function() {
        var name = $(this.$('name')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(name);

        if (name.val() !== '' && !validators.maxLength.fn(name.val(), 10)) {
            markers.text.invalid(name, validators.maxLength.message.replace(reg, 10));
            flag = false;
        }

        if (name.val().trim() === '' || name.val().trim() === null) {
            markers.text.invalid(name, validators.required.message);
            flag = false;
        }

        return flag;
    }
};
