var _ = require('lodash/collection');
exports.bindings = {
    course: true,
    download: false
};

exports.dataForTemplate = {
    files: function() {
        var me = this,
            attachList = this.bindings.course.data.courseAttachments;
        _.map(attachList || [], function(file, i) {
            var item = file;
            item.downUrl = me.bindings.download.getFullUrl() + '?id=' + item.attachmentId;
            item.i = i + 1;
            return item;
        });
        return attachList;
    }
};
