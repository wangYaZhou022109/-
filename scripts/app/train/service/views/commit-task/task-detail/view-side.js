exports.bindings = {
    task: true,
    preview: false,
    mainState: true
};

exports.events = {
    'click attachment-*': 'preview',
    'click taskDescription': 'changeMain'
};

exports.handlers = {
    preview: function(id) {
        var docUrl = this.bindings.preview.getFullUrl() + '/' + id,
            mainState = this.bindings.mainState.data,
            param = {
                flag: 'doc',
                docUrl: docUrl
            };
        mainState.isExplain = false;
        this.bindings.mainState.changed();
        this.module.dispatch('preview', param);
    },
    changeMain: function() {
        var mainState = this.bindings.mainState.data;
        mainState.isExplain = true;
        this.bindings.mainState.changed();
    }
};

exports.dataForTemplate = {
    task: function(data) {
        var task = data.task;
        var attachs = data.task.attachList || [];
        var taskMembers = data.task.taskMemberList || [];
        var len = taskMembers.length;
        if (attachs.length !== 0) {
            task.hasAttach = true;
        } else {
            task.hasAttach = false;
        }
        if (taskMembers.length !== 0) {
            task.hasTaskMember = true;
        } else {
            task.hasTaskMember = false;
        }
        if (len === 0) {
            task.btnType = 1;
        } else if (taskMembers[len - 1].state === 4) {
            task.btnType = 2;
        } else {
            task.btnType = 0;
        }
        return task;
    }
};
