var $ = require('jquery');

exports.bindings = {
    waitTrainees: true,
    state: false
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        var state = this.bindings.state.data,
            classId = state.classId,
            auditStatus = state.auditStatus,
            groupId = state.groupId;
        return {
            classId: classId,
            auditStatus: auditStatus,
            groupId: groupId,
            memberName: $(this.$$('[name="memberName"]')).val().trim(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val().trim(),
            organizationName: $(this.$$('[name="organizationName"]')).val().trim()
        };
    }
};
