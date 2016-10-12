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
    downUrl: function() {
        if (this.bindings.img.data.imgId) {
            return this.bindings.down.getFullUrl() + '?id=' + this.bindings.img.data.imgId;
        }
        return '';
    }
};
