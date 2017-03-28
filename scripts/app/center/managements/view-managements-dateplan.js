
exports.events = {
    'click weektopic': 'showWeektopic',
    'click addclass': 'showAddclass'
};

exports.handlers = {
    showWeektopic: function() {
        var model = this.module.items['center/managements/weektopic'];
        this.app.viewport.modal(model);
    },
    showAddclass: function() {
        var model = this.module.items['center/managements/addclass'];
        this.app.viewport.modal(model);
    }
};
