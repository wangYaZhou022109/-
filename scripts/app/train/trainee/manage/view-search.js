var $ = require('jquery');

exports.bindings = {
    trainees: true,
    state: false
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        var state = this.bindings.state.data,
            classId = state.classId;
        return {
            classId: classId,
            memberName: $(this.$$('[name="memberName"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            organizationName: $(this.$$('[name="organizationName"]')).val()
        };
    }
};
