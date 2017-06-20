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
    preview: function(id, e, element) {
        var docUrl = this.bindings.preview.getFullUrl() + '/' + id,
            contentType = element.getAttribute('content-type'),
            param = {
                flag: 'doc',
                docUrl: docUrl
            };
        if (Number(contentType) !== 1) param.flag = 'down';
        this.module.dispatch('preview', param);
    },
    viewUseDesc: function(id, e, element) {
        var progress = this.bindings.section.data.progress || {},
            attachments = progress.sectionAttachments,
            contentType = element.getAttribute('content-type'),
            attachment = _.find(attachments, { id: id }),
            param = {
                flag: 'useDesc',
                description: attachment.description
            };
        if (Number(contentType) !== 1) param.flag = 'down';
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
                return obj;
            });
        }
        return null;
    }
};
