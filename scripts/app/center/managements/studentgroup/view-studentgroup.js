exports.events = {
    'click groupmanage-*': 'showGroupmanage'
};

exports.handlers = {
    showGroupmanage: function() {
        var model = this.module.items['center/managements/studentgroup/groupmanage'];
        this.app.viewport.modal(model);
    }
};
