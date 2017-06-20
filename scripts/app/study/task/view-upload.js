var _ = require('lodash/collection'),
    getFileType;

exports.title = '文件上传';

exports.bindings = {
    file: 'changeFile',
    task: false
};

exports.components = function() {
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            model: 'file',
            multi_selection: false,
            filters: {
                max_file_size: '100mb',
                mime_types: [{
                    title: 'files',
                    extensions: 'xls,xlsx,doc,docx,ppt,pptx,zip,txt,rar,pdf,epub,mp3,mp4'
                }]
            }
        }
    }];
};

exports.changeFile = function() {
    var imgs = this.bindings.file.data.imgs;
    var items = _.map(imgs, function(v) {
        var extend = v.filename.split('.').pop();
        var fileType = getFileType(extend);
        return {
            contentType: fileType,
            attachmentId: v.id,
            name: v.filename
        };
    });
    this.module.dispatch('addFile', items);
    this.app.viewport.closeModal();
};

getFileType = function(data) {
    var extend = data.toLocaleLowerCase();
    var fileTypes = {
        1: ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'pdf'],
        5: ['mp3'],
        6: ['mp4'],
        4: ['rar', 'zip'],
        2: ['jpg', 'jpeg', 'png', 'bmp', 'gif'],
        7: ['epub']
    };
    return (function() {
        return _.find(Object.keys(fileTypes), function(type) {
            return fileTypes[type].indexOf(extend) !== -1;
        }) || 0;
    }());
};
