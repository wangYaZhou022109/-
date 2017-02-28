var $ = require('jquery');

exports.bindings = {
    fmtrainees: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            classId: 3,
            auditStatus: 1,
            memberName: $(this.$$('[name="memberName"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            organizationName: $(this.$$('[name="organizationName"]')).val()
        };
    }
};
