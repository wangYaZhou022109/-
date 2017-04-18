var _ = require('lodash/collection'),
    $ = require('jquery'),
    findExtension;

var title = { add: '添加作业', update: '编辑作业' };

exports.type = 'form';

exports.title = function() {
    return title[this.bindings.state.data.type];
};

exports.bindings = {
    state: true,
    task: true,
    files: true,
    download: false
};

exports.dataForTemplate = {
    files: function(data) {
        var me = this;
        _.map(data.files || [], function(file, i) {
            var item = file,
                extension;
            extension = item.attachmentName.split('.').pop().toLowerCase();
            item.fileType = findExtension.call(me, extension);
            item.downUrl = me.bindings.download.getFullUrl() + '?id=' + item.attachmentId;
            item.i = i + 1;
            item.canPreview = item.fileType !== 2;
        });
        return data.files;
    },
    task: function(data) {
        var task = data.task || {};
        var taskReviewer = task.taskReviewer || [];
        _.map(taskReviewer || [], function(reviewer) {
            var obj = reviewer;
            obj.memberId = obj.approvalMemberId;
            return obj;
        });
        return task;
    },
};

exports.events = {
    'click chooseFile': 'uploadTaskFile',
    'click label-attach-*': 'changeTaskName',
    'change input-attach-*': 'updateTaskAttachName',
    'click preview-attach-*': 'preview',
    'click selectMember': 'showMember',
    'click clearMembers': 'clearMembers'
};

exports.handlers = {
    showMember: function() {
        var me = this,
            model = me.module.items['train/programme/select-member'];
        me.app.viewport.modal(model, {
            ids: me.components.tags.getValue(),
            callback: function(payload, flag) {     // 选中添加，非选中取消添加。
                flag ? me.components.tags.addItem({ value: payload.id, text: payload.name }) :
                    me.components.tags.removeItem(payload.id);
            }
        });
    },
    clearMembers: function() {
        var me = this;
        me.components.tags.clear();
    },
    uploadTaskFile: function() {
        var view = this.module.items.uploadTask,
            task = this.bindings.task.data,
            files = this.bindings.files.data,
            state = this.bindings.state;
        state.data.uploadType = false;
        if (files.length >= 3) {
            this.app.message.alert('课件最多只能上传3个');
        } else {
            task.name = $(this.$('name')).val();
            task.startTime = $(this.$('startTime')).val();
            task.endTime = $(this.$('endTime')).val();
            task.explain = $(this.$('explain')).val();
            task.memberIds = this.components.tags.getValue();
            this.app.viewport.modal(view);
        }
    },
    changeTaskName: function(id) {
        $(this.$('input-attach-' + id)).css('display', 'block');
        $(this.$('label-attach-' + id)).css('display', 'none');
    },
    updateTaskAttachName: function(id) {
        var state = this.bindings.state.data;
        var val = $(this.$('input-attach-' + id)).val();
        state.updateType = false;
        if (val === '') {
            this.app.message.alert('附件名称不能为空');
        } else {
            this.module.dispatch('updateTaskAttachName', { id: id, attachmentName: val });
        }
    },
    preview: function(id) {
        var viewPath,
            url = window.location.protocol + '//' + window.location.host + '/';
        viewPath = url + '#/train/programme/preview/' + id;
        window.open(viewPath);
    }
};

exports.actions = {
    'click saveTask': 'saveTask',
    'click del-attach-*': 'delTaskAttach'
};

exports.dataForActions = {
    saveTask: function(payload) {
        return this.validate() ? payload : false;
    },
    delTaskAttach: function(payload) {
        var task = this.bindings.task.data,
            state = this.bindings.state.data;
        task.name = payload.name;
        task.startTime = payload.startTime;
        task.endTime = payload.endTime;
        task.explain = payload.explain;
        state.delType = false;
        return payload;
    }
};

exports.actionCallbacks = {
};

findExtension = function(value) {
    var fileTypeDoc = 'xls,xlsx,doc,docx,ppt,pptx,txt,pdf',
        fileTypeZip = 'zip,rar',
        fileTypeMp3 = 'mp3',
        fileTypeMp4 = 'mp4',
        fileTypeMp5 = 'epub',
        type;
    if (fileTypeDoc.indexOf(value) > -1) {
        type = 1;
    }
    if (fileTypeZip.indexOf(value) > -1) {
        type = 2;
    }
    if (fileTypeMp3.indexOf(value) > -1) {
        type = 3;
    }
    if (fileTypeMp4.indexOf(value) > -1) {
        type = 4;
    }
    if (fileTypeMp5.indexOf(value) > -1) {
        type = 5;
    }
    return type;
};

exports.components = [{
    id: 'startTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'endTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, function() {
    var data = this.bindings.state.data;
    var inputName = data.inputName || 'memberIds',
        tags = data.tags || [];
    return {
        id: 'tags',
        name: 'tag-view',
        options: {
            name: inputName,
            emptyText: '请选择人员',
            tags: tags
        }
    };
}, function() {
    var data = this.bindings.task.data,
        memberItem = [];
    if (data.members) {
        _.map(data.members, function(x) {
            memberItem.push({
                text: x.auditUserName || x.text,
                value: x.memberId || x.value
            });
        });
    }
    return {
        id: 'auditMembers',
        name: 'picker',
        options: {
            picker: 'members',
            componentId: 'tags',
            inputName: 'auditMemberIds',
            tags: memberItem
        }
    };
}];
