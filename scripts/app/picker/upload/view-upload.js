exports.title = '请选择文件';

exports.bindings = {
    img: 'changeImg',
    state: false
};

exports.components = function() {
    var data = this.bindings.state.data,
        resize = data.data || {};
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            model: 'img',
            resize: {
                width: resize.width || 200,
                height: resize.height || 200,
                quality: 100,
                crop: true
            },
            signle_file: data.signle_file || false,
            filters: {
                max_file_size: resize.maxFileSize || '2mb',
                mime_types: [{
                    extensions: data.extensions || '*'
                }]
            },
            multi_selection: data.multi_selection || true,
            multipart_params: {
                thumbnailSize: data.thumbnailSize // 缩略图尺寸，格式为'高度,宽度',例:'300,200'，有值时会返回两条附件记录
            }
        }
    }];
};

exports.changeImg = function() {
    this.app.viewport.closeModal();
    this.module.dispatch('uploadSuccess', this.bindings.img.data);
};
