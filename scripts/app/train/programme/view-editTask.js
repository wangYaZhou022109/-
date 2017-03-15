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
            extension = item.attachName.split('.').pop().toLowerCase();
            item.fileType = findExtension.call(me, extension);
            item.downUrl = me.bindings.download.getFullUrl() + '?id=' + item.attachId;
            item.i = i + 1;
            item.canPreview = item.fileType !== 2;
        });
        return data.files;
    }
};

exports.events = {
    'click chooseFile': 'uploadFile',
    'click label-attach-*': 'changeName',
    'change input-attach-*': 'updateAttachName',
    'click preview-attach-*': 'preview'
};

exports.handlers = {
    uploadFile: function() {
        var view = this.module.items.upload,
            task = this.bindings.task.data,
            files = this.bindings.files.data,
            state = this.bindings.state;
        state.data.uploadType = false;
        if (files.length >= 3) {
            this.app.message.alert('课件最多只能上传3个');
        } else {
            task.name = $(this.$('name')).val();
            task.courseDate = $(this.$('startTime')).val();
            task.endTime = $(this.$('endTime')).val();
            task.explain = $(this.$('explain')).val();
            this.app.viewport.modal(view);
        }
    },
    changeName: function(id) {
        $(this.$('input-attach-' + id)).css('display', 'block');
        $(this.$('label-attach-' + id)).css('display', 'none');
    },
    updateAttachName: function(id) {
        var state = this.bindings.state.data;
        var val = $(this.$('input-attach-' + id)).val();
        state.updateType = false;
        if (val === '') {
            this.app.message.alert('附件名称不能为空');
        } else {
            this.module.dispatch('updateAttachName', { id: id, attachName: val });
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
    'click del-attach-*': 'delAttach'
};

exports.dataForActions = {
    saveTask: function(payload) {
        return this.validate() ? payload : false;
    },
    delAttach: function(payload) {
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
    saveTask: function() {
        this.app.viewport.closeModal();
    }
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

// exports.components = [{
//     id: 'startTime',
//     name: 'flatpickr',
//     options: {
//         enableTime: true
//     }
// }, {
//     id: 'endTime',
//     name: 'flatpickr',
//     options: {
//         enableTime: true,
//         noCalendar: true
//     }
// }];
