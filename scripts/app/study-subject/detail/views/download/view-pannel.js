var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    down: false,
};

exports.dataForTemplate = {
    courseAttachments: function(data) {
        var subject = data.subject,
            me = this;
        _.map(subject.courseAttachments, function(attachment) {
            var atta = attachment;
            atta.downUrl = me.bindings.down.getFullUrl() + '?id=' + atta.attachmentId;
            if (atta.attachmentType === 'application/pdf') {
                atta.isView = true;
            }
            return atta;
        });
        return subject.courseAttachments;
    }
};
