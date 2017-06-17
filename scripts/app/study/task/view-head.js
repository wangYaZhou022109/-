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
            submitBtn = [0, 1],
            progress = section.progress || {};
        progress.finishStatus = progress.finishStatus || 0;
        if (progress.score) progress.score = Number(progress.score) / 10;
        if (submitBtn.indexOf(progress.finishStatus) > -1) progress.submitBtn = true;
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
