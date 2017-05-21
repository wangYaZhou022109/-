var _ = require('lodash/collection'),
    studyUtil = require('./app/study/util/study_util');

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
        return {
            contentType: studyUtil.getContentType(v.contentType),
            attachmentId: v.id,
            name: v.filename
        };
    });
    this.module.dispatch('addFile', items);
    this.app.viewport.closeModal();
};
