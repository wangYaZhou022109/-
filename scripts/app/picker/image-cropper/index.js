var D = require('drizzlejs');
exports.title = '文件上传';


exports.items = {
    main: 'main',
    upload: ''
};

exports.store = {
    models: {
        img: { url: '../system/file/stream' },
        down: { url: '../system/file/download' },
        state: {}
    },
    callbacks: {
        uploadSuccess: function(imgData) {
            var callback = this.models.state.data.uploadSuccess;
            callback && callback(imgData);
        }
    }
};

exports.beforeRender = function() {
    var state = this.store.models.state;
    state.set(D.assign({
        inputName: 'file',
        cropperId: 'cropper',
        attributeId: 'attributeId'
    }, this.renderOptions));

    if (this.renderOptions.data.value) {
        this.store.models.img.set({ imgId: this.renderOptions.data.value });
    }
};

exports.mixin = {
    getData: function() {
        return this.store.models.state.data.imgData;
    }
};
