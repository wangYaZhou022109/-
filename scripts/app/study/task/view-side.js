var _ = require('lodash/collection');
exports.bindings = {
    task: true,
    preview: false,
    download: false,
    section: true
};

exports.events = {
    'click preview-*': 'preview'
};

exports.handlers = {
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
    }
};


exports.dataForTemplate = {
    task: function(data) {
        var task = data.task,
            me = this;
        _.map(task.attachments || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
            return obj;
        });
        return task;
    },
};
