exports.title = '文件上传';

exports.bindings = {
    file: 'changeFile'
};

exports.components = function() {
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            model: 'file',
            filters: {
                max_file_size: '100mb',
                mime_types: [{
                    title: 'files',
                    extensions: 'xls,xlsx,doc,docx,ppt,pptx,txt,pdf,epub,mp3,mp4'
                }]
            },
            multi_selection: false
        }
    }];
};

exports.changeFile = function() {
    var imgs = this.bindings.file.data.imgs;
    this.app.viewport.closeModal();
    this.renderOptions.callback(imgs[0]);
};
