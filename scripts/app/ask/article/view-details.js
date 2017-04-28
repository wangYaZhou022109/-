
exports.bindings = {
    task: true
};
exports.actions = {
    'click uploadFile': 'uploadFile',
};

exports.dataForActions = {
    uploadFile: function() {
        var view = this.module.items.upload;
        this.app.viewport.modal(view);
        return false;
    }
};

