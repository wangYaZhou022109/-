exports.events = {
    'click upload': 'showUpload'
};

exports.handlers = {
    showUpload: function() {
        var model = this.module.items['knowledge/index/modal'];
        this.app.viewport.modal(model);
    }
};
