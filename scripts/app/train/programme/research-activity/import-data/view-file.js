exports.bindings = {
    file: 'fileUpload'
};

exports.components = [{
    id: 'uploader',
    name: 'uploader',
    options: {
        model: 'file',
        chunk_size: '100mb',
        filters: {
            max_file_size: '100mb',
            mime_types: [{
                title: 'files',
                extensions: 'xls,xlsx'
            }]
        }
    }
}];

exports.fileUpload = function() {
    this.app.viewport.closeModal();
    return this.module.dispatch('importData', {
        fileId: this.bindings.file.data.imgId
    });
};
