var _ = require('lodash/collection');

exports.title = '文件上传';

exports.bindings = {
    file: 'changeFile',
    state: true
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
                max_file_size: '1mb',
                mime_types: [{
                    title: 'files',
                    extensions: 'jpg,jpeg,png,bmp,gif,ico,tif'
                }]
            }
        }
    }];
};

exports.changeFile = function() {
    var imgs = this.bindings.file.data.imgs,
        state = this.bindings.state.data;
    var items = _.map(imgs, function(v) {
        return {
            contentType: v.contentType,
            attachmentId: v.id,
            name: v.filename
        };
    });
    if (state.type === 'cover') {
        this.module.dispatch('addCoverFile', items);
    } else {
        this.module.dispatch('addBannerFile', items);
    }
    this.app.viewport.closeModal();
};
