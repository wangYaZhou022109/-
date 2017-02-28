var $ = require('jquery');

exports.bindings = {
    trainees: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            classId: 3,
            auditStatus: 0,
            memberName: $(this.$$('[name="memberName"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            organizationName: $(this.$$('[name="organizationName"]')).val()
        };
    }
};
