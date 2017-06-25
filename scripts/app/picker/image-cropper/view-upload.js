var D = require('drizzlejs');

exports.title = '请选择图片';

exports.cropper = true;

exports.bindings = {
    img: 'changeImageCropper',
    state: true
};

exports.components = [function() {
    var data = this.bindings.state.data,
        obj = {
            id: 'uploader',
            name: 'image-cropper',
            options: {
                model: 'img',
                id: data.cropperId,
                attributeId: data.attributeId
            }
        };
    D.assign(obj.options, data);
    return obj;
}];

exports.changeImageCropper = function() {
    this.app.viewport.closeModal();
    this.module.dispatch('uploadSuccess', this.bindings.img.data);
};
