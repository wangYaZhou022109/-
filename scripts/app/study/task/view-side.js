var _ = require('lodash/collection');
exports.bindings = {
    task: true,
    preview: false,
    download: false,
    section: true
};

exports.events = {
    'click viewDesc': 'viewDesc',
    'click preview-*': 'preview',
    'click viewUseDesc-*': 'viewUseDesc'
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
    },
    viewUseDesc: function(id) {
        var progress = this.bindings.section.data.progress || {},
            attachments = progress.sectionAttachments,
            attachment = _.find(attachments, { id: id });
        this.module.dispatch('preview', {
            flag: 'useDesc',
            description: attachment.description
        });
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
    userAttachments: function(data) {
        var progress = data.section.progress || {},
            attachments = progress.sectionAttachments,
            me = this;
        if (attachments && attachments.length > 0) {
            return _.map(attachments, function(attach) {
                var obj = attach;
                obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
                if (obj.contentType && obj.contentType === 1) {
                    obj.preview = true;
                }
                return obj;
            });
        }
        return null;
    }
};
