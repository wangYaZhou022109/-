exports.title = '请选择文件';

exports.bindings = {
    img: 'changeImg'
};

exports.components = function() {
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            model: 'img'
        }
    }];
};

exports.changeImg = function() {
    this.app.viewport.closeModal();
};
