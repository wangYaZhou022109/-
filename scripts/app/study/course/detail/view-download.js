var _ = require('lodash/collection');
var viewHandler;
exports.bindings = {
    course: true,
    download: false
};
exports.events = {
    'click preview-*': 'preview'
};

exports.handlers = {
    preview: function(id, e, ele) {
        var type = ele.getAttribute('data-attachmentType');
        var name = ele.getAttribute('data-name');
        if (viewHandler[type]) {
            viewHandler[type].call(this, {
                id: id,
                name: name
            });
        }
    }
}

exports.dataForTemplate = {
    attachments: function(data) {
        var course = data.course,
            me = this;
        return _.map(course.courseAttachments, function(attachment) {
            var atta = attachment;
            atta.downUrl = me.bindings.download.getFullUrl() + '?id=' + atta.attachmentId;
            atta.canPreview = !!viewHandler[attachment.attachmentType];    // 能预览
            return atta;
        });
    }
};

viewHandler = {
    // audio
    1: function(payload) {
        var view = this.module.items['preview-pdf'];
        this.app.viewport.ground(view, { name: payload.name, attachmentId: payload.id });
    },
    2: function(payload) {
        var view = this.module.items['preview-img'];
        this.app.viewport.ground(view, { name: payload.name, attachmentId: payload.id });
    },
    6: function(payload) {
        var view = this.module.items['preview-video'];
        this.app.viewport.modal(view, { name: payload.name, attachmentId: payload.id });
    },
    5: function(payload) {
        var view = this.module.items['preview-audio'];
        this.app.viewport.modal(view, { name: payload.name, attachmentId: payload.id });
    }
};

