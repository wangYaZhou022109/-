var _ = require('lodash/collection');
exports.bindings = {
    task: true,
    preview: false,
    section: true
};

exports.events = {
    'click closeTask': 'closeTask',
    'click taskDescription': 'taskDescription',
    'click preview-*': 'preview',
    'click submitTask': 'submitTask',
    'click viewDesc': 'viewDesc'
};

exports.handlers = {
    closeTask: function() {
        window.close();
    },
    viewDesc: function() {
        this.module.dispatch('preview', {
            flag: 'desc'
        });
    },
    preview: function(id) {
        var docUrl = this.bindings.preview.getFullUrl() + '/' + id,
            param = {
                flag: 'doc',
                docUrl: docUrl
            };
        this.module.dispatch('preview', param);
    },
    submitTask: function() {
        this.app.viewport.modal(this.module.items.edit);
    }
};


exports.dataForTemplate = {
    task: function(data) {
        var task = data.task,
            me = this;
        _.map(task.attachments || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.preview.getFullUrl() + '/' + obj.attachmentId;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
        });
        return task;
    },
};
