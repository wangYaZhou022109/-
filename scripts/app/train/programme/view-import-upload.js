var _ = require('lodash/collection');

exports.title = '文件上传';

exports.bindings = {
    importFile: 'changeFile',
    fileInfo: true,
    state: false
};

exports.components = function() {
    return [{
        id: 'uploader2',
        name: 'uploader',
        options: {
            model: 'importFile',
            chunk_size: '100mb',
            multi_selection: false,
            filters: {
                max_file_size: '100mb',
                mime_types: [{
                    title: 'files',
                    extensions: 'xls,xlsx'
                }]
            }
        }
    }];
};

exports.changeFile = function() {
    var imgs = this.bindings.importFile.data.imgs,
        state = this.bindings.fileInfo,
        classId = this.bindings.state.data.classId;
    var items = _.map(imgs, function(v) {
        return {
            contentType: v.contentType,
            attachmentId: v.id,
            name: v.filename
        };
    });
    state.data = items[0];
    // state.changed();
    this.module.dispatch('importFile', { attachmentId: items[0].attachmentId, classId: classId });
    // this.app.viewport.closeModal();
};
