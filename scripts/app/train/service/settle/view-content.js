var $ = require('jquery');
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
