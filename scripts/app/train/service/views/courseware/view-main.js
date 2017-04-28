var _ = require('lodash/collection'),
    findExtension;
exports.bindings = {
    attachList: true,
    download: false
};

exports.dataForTemplate = {
    files: function() {
        var me = this,
            attachList = this.bindings.attachList.data;
        _.map(attachList || [], function(file, i) {
            var item = file,
                extension;
            extension = item.attachName.split('.').pop().toLowerCase();
            item.fileType = findExtension.call(me, extension);
            item.downUrl = me.bindings.download.getFullUrl() + '?id=' + item.attachId;
            item.i = i + 1;
            item.canPreview = item.fileType !== 2;
            return item;
        });
        return attachList;
    }
};

exports.events = {
    'click preview-*': 'preview'
};

exports.handlers = {
    preview: function(id) {
        var viewPath,
            url = window.location.protocol + '//' + window.location.host + '/';
        viewPath = url + '#/train/programme/preview/' + id;
        window.open(viewPath);
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
