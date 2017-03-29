var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.title = '文件上传';

exports.bindings = {
    imgParse: 'changeFile'
};

exports.components = function() {
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            model: 'imgParse',
            chunk_size: '100mb',
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
    var chapterId = this.renderOptions.id,
        imgs = this.bindings.imgParse.data.imgs;
    var items = _.map(imgs, function(v) {
        return {
            contentType: v.contentType,
            id: D.uniqueId('tempSectionfile'),
            resourceId: v.id,
            attachmentId: v.id,
            chapterId: chapterId,
            name: v.filename,
            require: 1
        };
    });
    this.module.dispatch('addFile', items);
    this.app.viewport.closeModal();
};

