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
        var section = data.section;
        return section.progress;
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
