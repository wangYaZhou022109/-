
exports.events = {
    'click weektopic': 'showWeektopic',
    'click addclass': 'showAddclass',
    'click topic': 'showTopic'
};

exports.handlers = {
    showWeektopic: function() {
        var model = this.module.items['center/managements/weektopic'];
        this.app.viewport.modal(model);
    },
    showAddclass: function() {
        var model = this.module.items['center/managements/addclass'];
        this.app.viewport.modal(model);
    },
    showTopic: function() {
        var model = this.module.items['center/managements/topic'];
        this.app.viewport.modal(model);
    }
};
