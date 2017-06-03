var _ = require('lodash/collection');
exports.bindings = {
    sectionStudyProgress: false,
    task: true,
    download: false
};

exports.dataForTemplate = {
    task: function(data) {
        var task = data.task,
            me = this;
        _.map(task.attachments || [], function(attach) {
            var obj = attach;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
        });
        return task;
    },
    sectionStudyProgress: function(data) {
        var sectionStudyProgress = data.sectionStudyProgress,
            me = this;
        _.map(sectionStudyProgress.sectionAttachments || [], function(attach) {
            var obj = attach;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
            if (obj.attachmentId) {
                obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            }
        });
        return sectionStudyProgress;
    }
};
