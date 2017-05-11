var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');
exports.bindings = {
    settlement: true
};

exports.events = {
    'change input-class-*': 'updateName'
};
exports.actions = {
    'click saveBalanceSubmit*': 'save',
};
exports.handlers = {
    updateName: function() {
        var number = $(this.$$('[name="peopleNumber"]')).val();
        var day = $(this.$$('[name="dayNumber"]')).val();
        var peopleDay = number * day;
        $(this.$$('[name="peopleDay"]')).val(peopleDay);
    }
};
exports.dataForActions = {
    updateClass: function(payload) {
        return this.validate() ? payload : false;
    },
    save: function(payload) {
        var peopleNumber = $(this.$$('[name="peopleNumber"]')).val();
        var createMouth = $(this.$$('[name="createMouth"]')).val();
        if (!validators.required.fn(peopleNumber)) {
            this.app.message.error('结算人数必填');
            return false;
        }
        if (!validators.required.fn(createMouth)) {
            this.app.message.error('结算月份必填');
            return false;
        }
        return payload;
    }
};
exports.actionCallbacks = {
    save: function() {
        this.app.message.success('保存成功！');
    }
};
exports.mixin = {
    validate: function() {
        return {
            peopleNumber: $(this.$$('[name="peopleNumber"]')),
            dayNumber: $(this.$$('[name="dayNumber"]')),
            peopleDay: $(this.$$('[name="peopleDay"]')),
            classId: $(this.$$('[name="classId"]')),
        };
    },

};
