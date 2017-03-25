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
        var img = data.img;
        if (img.imgId || img.imgs) {
            return this.bindings.down.getFullUrl() + '?id=' + (img.imgId || img.imgs[0].id);
        }
        return 'images/d1.jpg';
    },
    fileId: function() {
        var img = this.bindings.img.data;
        return img.imgId || (img.imgs && img.imgs.length && img.imgs[0].id);
    },
    btnName: function(data) {
        return data.state.data.btnName || false;
    },
    btnClass: function(data) {
        return data.state.data.btnClass;
    },
    defaultCss: function(data) {
        return data.state.data.defaultCss || 'user-pic';
    }
};
