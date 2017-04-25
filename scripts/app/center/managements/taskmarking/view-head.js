exports.events = {
    'click submittask': 'showSubmittask'
};

exports.handlers = {
    showSubmittask: function() {
        var model = this.module.items['center/managements/taskmarking/submittask'];
        this.app.viewport.modal(model);
    }
};
