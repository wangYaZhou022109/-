var _ = require('lodash/collection');

exports.title = '照片上传';

exports.bindings = {
    img: 'changeFile',
    state: true
};

exports.components = function() {
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            model: 'img',
            resize: {
                crop: false
            },
            multipart_params: {
                thumbnailSize: '300,300' // 缩略图尺寸，格式为'高度,宽度',例:'300,200'，有值时会返回两条附件记录
            }
        }
    }];
};

exports.changeFile = function() {
    var imgs = this.bindings.img.data.imgs;
    var items = _.map(imgs, function(v) {
        return {
            attachmentId: v.id,
            name: v.filename,
            thumbnailId: v.thumbnailId
        };
    });
    this.module.dispatch('addFile', items);
    this.app.viewport.closeModal();
};
