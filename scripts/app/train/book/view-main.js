var markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    $ = require('jquery');

exports.bindings = {
    projectInfo: true
};

exports.events = {
    'click bookTime': 'book'
};

exports.handlers = {
    book: function() {
        var me = this,
            model = me.module.items.toolbox;

        me.app.viewport.ground(model);
    }
};

exports.actions = {
    'click submit': 'submit'
};

exports.dataForTemplate = {
    projectInfo: function(data) {
        var d = data.projectInfo;
        d.checked = false;
        d.checked = d.classInfo.isOutside === 1;
        return d;
    }
};

exports.dataForActions = {
    submit: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {

};

exports.components = [{
    id: 'arriveDate',
    name: 'flatpickr'
}, {
    id: 'returnDate',
    name: 'flatpickr'
}];

exports.mixin = {
    validate: function() {
        var contactPhone = $(this.$('contactPhone')),
            contactEmail = $(this.$('contactEmail')),
            surveyType = $(this.$('surveyType')),
            arriveDate = $(this.$('arriveDate')),
            returnDate = $(this.$('returnDate')),
            target = $(this.$('target')),
            object = $(this.$('object')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(contactPhone);
        markers.text.valid(contactEmail);
        markers.text.valid(surveyType);
        markers.text.valid(returnDate);
        markers.text.valid(arriveDate);
        markers.text.valid(target);
        markers.text.valid(object);

        if (!validators.required.fn(contactPhone.val())) {
            markers.text.invalid(contactPhone, validators.required.message);
            flag = false;
        }
        if (!validators.phone.fn(contactPhone.val())) {
            markers.text.invalid(contactPhone, validators.phone.message);
            flag = false;
        }
        if (!validators.required.fn(contactEmail.val())) {
            markers.text.invalid(contactEmail, validators.required.message);
            flag = false;
        }
        if (!validators.email.fn(contactEmail.val())) {
            markers.text.invalid(contactEmail, validators.email.message);
            flag = false;
        }
        if (!validators.required.fn(surveyType.val())) {
            markers.text.invalid(surveyType, validators.required.message);
            flag = false;
        }
        if (!validators.maxLength.fn(surveyType.val(), 100)) {
            markers.text.invalid(surveyType, validators.maxLength.message.replace(reg, 100));
            flag = false;
        }
        if (!validators.required.fn(returnDate.val())) {
            markers.text.invalid(returnDate, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(arriveDate.val())) {
            markers.text.invalid(arriveDate, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(target.val())) {
            markers.text.invalid(target, validators.required.message);
            flag = false;
        }
        if (!validators.maxLength.fn(target.val(), 2000)) {
            markers.text.invalid(target, validators.maxLength.message.replace(reg, 2000));
            flag = false;
        }
        if (!validators.required.fn(object.val())) {
            markers.text.invalid(object, validators.required.message);
            flag = false;
        }
        if (!validators.maxLength.fn(object.val(), 2000)) {
            markers.text.invalid(object, validators.maxLength.message.replace(reg, 2000));
            flag = false;
        }
        return flag;
    }
};
