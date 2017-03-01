var _ = require('lodash/collection'),
    $ = require('jquery'),
    findExtension;

var title = { add: '添加课程', update: '编辑课程' };

exports.large = true;

exports.type = 'form';

exports.title = function() {
    return title[this.bindings.state.data.type];
};

exports.bindings = {
    state: true,
    offlineCourse: true,
    classroomList: true,
    files: true
};

exports.dataForTemplate = {
    checked: function(data) {
        var offlineCourse = data.offlineCourse;
        return {
            type1: offlineCourse.type === '1' || offlineCourse.type === 1,
            type2: offlineCourse.type === '2' || offlineCourse.type === 2,
            type3: offlineCourse.type === '3' || offlineCourse.type === 3,
            type4: offlineCourse.type === '4' || offlineCourse.type === 4,
            teacherType0: offlineCourse.teacherType === '0' || offlineCourse.teacherType === 0,
            teacherType1: offlineCourse.teacherType === '1' || offlineCourse.teacherType === 1
        };
    },
    classroomList: function(data) {
        _.map(data.classroomList || [], function(classroom) {
            var item = classroom;
            if (data.offlineCourse && data.offlineCourse.classroomId && item.id === data.offlineCourse.classroomId) {
                item.selected = true;
            }
        });
        return data.classroomList;
    },
    files: function(data) {
        var me = this;
        _.map(data.files || [], function(file, i) {
            var item = file,
                extension;
            extension = item.attachName.split('.').pop().toLowerCase();
            item.fileType = findExtension.call(me, extension);
            item.i = i + 1;
        });
        return data.files;
    }
};

exports.events = {
    'click chooseFile': 'uploadFile',
    'click label-attach-*': 'changeName',
    'change input-attach-*': 'updateAttachName'
};

exports.handlers = {
    uploadFile: function() {
        var view = this.module.items.upload,
            offlineCourse = this.bindings.offlineCourse.data,
            files = this.bindings.files.data,
            state = this.bindings.state;
        state.data.uploadType = false;
        if (files.length >= 3) {
            this.app.message.alert('课件最多只能上传3个');
        } else {
            offlineCourse.type = $(this.$('type')).val();
            offlineCourse.name = $(this.$('name')).val();
            offlineCourse.courseDate = $(this.$('courseDate')).val();
            offlineCourse.endTime = $(this.$('endTime')).val();
            offlineCourse.classroomId = $(this.$('classroomId')).val();
            offlineCourse.teacherName = $(this.$('teacherName')).val();
            offlineCourse.teacherOrganization = $(this.$('teacherOrganization')).val();
            offlineCourse.teacherTitle = $(this.$('teacherTitle')).val();
            offlineCourse.teacherPhone = $(this.$('teacherPhone')).val();
            offlineCourse.teacherType = $(this.$('teacherType')).val();
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
    }
};

exports.actions = {
    'click submitOffline': 'submitOffline',
    'click del-attach-*': 'delAttach'
};

exports.dataForActions = {
    submitOffline: function(payload) {
        return this.validate() ? payload : false;
    },
    delAttach: function(payload) {
        var offlineCourse = this.bindings.offlineCourse.data,
            state = this.bindings.state.data;
        offlineCourse.type = payload.type;
        offlineCourse.name = payload.name;
        offlineCourse.courseDate = payload.courseDate;
        offlineCourse.endTime = payload.endTime;
        offlineCourse.classroomId = payload.classroomId;
        offlineCourse.teacherName = payload.teacherName;
        offlineCourse.teacherOrganization = payload.teacherOrganization;
        offlineCourse.teacherTitle = payload.teacherTitle;
        offlineCourse.teacherPhone = payload.teacherPhone;
        offlineCourse.teacherType = payload.teacherType;
        state.delType = false;
        return payload;
    }
};

exports.actionCallbacks = {
    submitOffline: function() {
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

exports.components = [{
    id: 'courseDate',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'endTime',
    name: 'flatpickr',
    options: {
        enableTime: true,
        noCalendar: true
    }
}];
