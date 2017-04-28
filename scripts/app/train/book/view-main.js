var markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    helpers = require('./app/util/helpers'),
    $ = require('jquery');

exports.bindings = {
    projectInfo: true,
    state: true
};

exports.events = {
    'click bookTime': 'book'
};

exports.handlers = {
    book: function() {
        var me = this,
            model = me.module.items['train/book-time'],
            projectInfo = this.bindings.projectInfo;
        me.app.viewport.modal(model, {
            project: projectInfo.data,
            callback: function(arriveDate, backDate) {
                me.module.dispatch('changeDate', { arriveDate: arriveDate, backDate: backDate });
            }
        });
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
        if (d.status !== 2 && d.status !== 3) {
            d.isShowCommit = true;
        }
        return d;
    },
    state: function() {
        var state = this.bindings.state.data,
            projectInfo = this.bindings.projectInfo.data,
            arriveDate,
            returnDate;
        if (projectInfo.classInfo) {
            arriveDate = helpers.date(projectInfo.classInfo.arriveDate);
            returnDate = helpers.date(projectInfo.classInfo.returnDate);
            state.roundDate = arriveDate + '~' + returnDate;
            state.arriveDate = arriveDate;
            state.returnDate = returnDate;
        }
        return state;
    }
};

exports.dataForActions = {
    submit: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {

};

exports.components = [];

exports.mixin = {
    validate: function() {
        var contactPhone = $(this.$('contactPhone')),
            contactEmail = $(this.$('contactEmail')),
            surveyType = $(this.$('surveyType')),
            roundDate = $(this.$('roundDate')),
            arriveDate = $(this.$('arriveDate')),
            target = $(this.$('target')),
            object = $(this.$('object')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(contactPhone);
        markers.text.valid(contactEmail);
        markers.text.valid(surveyType);
        markers.text.valid(roundDate);
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
        if (!validators.required.fn(arriveDate.val())) {
            markers.text.invalid(roundDate, validators.required.message);
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
