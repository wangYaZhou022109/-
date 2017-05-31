var _ = require('lodash/collection');
exports.bindings = {
    task: true,
    preview: false,
    mainState: true,
    download: false,
    taskMemberModel: true
};

exports.events = {
    'click attachment-*': 'preview',
    'click taskDescription': 'changeMain',
    'click commitTask': 'showCommitView'
};

exports.handlers = {
    preview: function(id, e, target) {
        var attachType = target.getAttribute('attachType'),
            preview = target.getAttribute('preview'),
            docUrl = this.bindings.preview.getFullUrl() + '/' + id,
            mainState = this.bindings.mainState.data,
            taskMemberModel = this.bindings.taskMemberModel,
            task = this.bindings.task.data,
            param = { flag: 'doc', docUrl: docUrl };
        mainState.isExplain = false;
        this.bindings.mainState.changed();
        if (attachType === '2') {
            taskMemberModel.data = _.find(task.taskMemberList, ['attachmentId', id]);
        }
        if (attachType === '1') {
            this.bindings.taskMemberModel.clear();
        }
        this.bindings.taskMemberModel.changed();
        if (preview === '1') {
            this.module.dispatch('preview', param);
        } else {
            this.app.message.alert('该文件为压缩文件,请下载查看!');
        }
    },
    changeMain: function() {
        var mainState = this.bindings.mainState.data;
        mainState.isExplain = true;
        this.bindings.mainState.changed();
    },
    showCommitView: function() {
        this.app.viewport.modal(this.module.items.edit);
    }
};

exports.dataForTemplate = {
    task: function(data) {
        var me = this;
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
        _.map(attachs || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            obj.preview = 1;
            if (obj.attachmentType === 'application/octet-stream') {
                obj.preview = 0;
            }
            return obj;
        });
        _.map(taskMembers || [], function(tm) {
            var obj = tm;
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            obj.preview = 1;
            if (obj.attachmentType === 'application/octet-stream') {
                obj.preview = 0;
            }
            return obj;
        });
        return task;
    },
    taskMemberModel: function(data) {
        var taskMemberModel = data.taskMemberModel;
        var taskApproval = data.taskMemberModel.taskApproval || {};
        if (taskApproval.comment) {
            taskMemberModel.hasComment = true;
        }
        return taskMemberModel;
    }
};
