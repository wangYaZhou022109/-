exports.bindings = {
    task: true,
    taskMemberModel: true
};

exports.events = {
    'click closeTask': 'closeTask'
};

exports.handlers = {
    closeTask: function() {
        window.close();
    }
};

exports.dataForTemplate = {
    taskMemberModel: function(data) {
        var taskMember = data.taskMemberModel;
        if (taskMember.id) {
            if (!taskMember.taskApproval.id) {
                taskMember.type = 1;
            } else if (taskMember.taskApproval.state === 0) {
                taskMember.type = 2;
            } else if (taskMember.taskApproval.state === 1) {
                taskMember.type = 3;
            }
        }
        return taskMember;
    }
};
