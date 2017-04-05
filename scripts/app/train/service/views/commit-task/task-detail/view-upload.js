var _ = require('lodash/collection');

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
            chunk_size: '3mb',
            multi_selection: false,
            filters: {
                max_file_size: '100mb',
                mime_types: [{
                    title: 'files',
                    extensions: 'xls,xlsx,doc,docx,ppt,pptx,pdf,txt,zip'
                }]
            }
        }
    }];
};

exports.changeFile = function() {
    var img = this.bindings.file.data.imgs[0];
    var items = {
        contentType: img.contentType,
        attachmentId: img.id,
        name: img.filename
    };
    this.module.dispatch('uploadTaskMember', items);
    this.app.viewport.closeModal();
};
