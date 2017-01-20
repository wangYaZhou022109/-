exports.bindings = {
    task: true,
    section: true
};


exports.events = {
    'click closeTask': 'closeTask',
    'click submitTask': 'submitTask'
};

exports.dataForTemplate = {
    progress: function(data) {
        var section = data.section,
            progress = section.progress || {};
        progress.finishStatus = progress.finishStatus || 0;
        return progress;
    }
};

exports.handlers = {
    closeTask: function() {
        window.close();
    },
    submitTask: function() {
        this.app.viewport.modal(this.module.items.edit);
    }
};
