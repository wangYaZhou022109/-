var _ = require('lodash/collection'),
    viewHandler;
exports.bindings = {
    region: false,
    subject: false,
    down: false,
    attachment: false
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
};

exports.dataForTemplate = {
    courseAttachments: function(data) {
        var subject = data.subject,
            me = this;
        _.map(subject.courseAttachments, function(attachment) {
            var atta = attachment;
            atta.downUrl = me.bindings.down.getFullUrl() + '?id=' + atta.attachmentId;
            atta.canPreview = !!viewHandler[attachment.attachmentType];
            return atta;
        });
        return subject.courseAttachments;
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
