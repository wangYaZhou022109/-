var _ = require('lodash/collection'),
    $ = require('jquery'),
    findExtension;

exports.large = true;

exports.bindings = {
    offlineCourse: true,
    files: true,
    state: true,
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
            return item;
        });
        return data.files;
    }
};

exports.events = {
    'click uploadFile': 'uploadFile',
    'click label-courseware-*': 'changeName',
    'change input-courseware-*': 'updateAttachName',
    'click preview-*': 'preview'
};

exports.handlers = {
    uploadFile: function() {
        var view = this.module.items.upload,
            files = this.bindings.files.data,
            state = this.bindings.state;
        state.data.uploadType = true;
        if (files && files.length >= 3) {
            this.app.message.alert('课件最多只能上传3个');
        } else {
            this.app.viewport.modal(view);
        }
    },
    changeName: function(id) {
        $(this.$('input-courseware-' + id)).css('display', 'block');
        $(this.$('label-courseware-' + id)).css('display', 'none');
    },
    updateAttachName: function(id) {
        var state = this.bindings.state.data;
        var val = $(this.$('input-courseware-' + id)).val();
        state.updateType = true;
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
    'click del-courseware-*': 'delAttach'
};

exports.dataForActions = {
    delAttach: function(payload) {
        var state = this.bindings.state.data;
        state.delType = true;
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
