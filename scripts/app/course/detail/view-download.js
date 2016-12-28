var _ = require('lodash/collection');

exports.bindings = {
    course: true,
    download: false
};

exports.dataForTemplate = {
    attachments: function(data) {
        var course = data.course,
            me = this;
        _.map(course.courseAttachments, function(attachment) {
            var atta = attachment;
            atta.downUrl = me.bindings.download.getFullUrl() + '?id=' + atta.attachmentId;
            if (atta.attachmentType === 'application/pdf') {
                atta.isView = true;
            }
            return atta;
        });
        return data.course.courseAttachments;
    }
};
