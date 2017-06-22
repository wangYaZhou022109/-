exports.bindings = {
    state: false,
    down: false,
    img: true
};

exports.events = {
    'click select': 'showUpdate'
};

exports.handlers = {
    showUpdate: function() {
        this.app.viewport.modal(this.module.items.upload);
    }
};

exports.dataForTemplate = {
    downUrl: function(data) {
        var img = data.img,
            url = data.state.defaultImg;
        if (img.imgId || img.imgs) {
            url = this.bindings.down.getFullUrl() + '/' + (img.imgId || img.imgs[0].id);
        }
        return url;
    },
    fileId: function() {
        var img = this.bindings.img.data;
        return img.imgId || (img.imgs && img.imgs.length && img.imgs[0].id);
    },
    btnName: function(data) {
        return data.state.data.btnName || '选择图片';
    },
    btnClass: function(data) {
        return data.state.data.btnClass;
    },
    width: function(data) {
        return data.state.width;
    },
    height: function(data) {
        return data.state.height;
    },
    defaultCss: function(data) {
        return data.state.data.defaultCss || 'user-pic';
    }
};
