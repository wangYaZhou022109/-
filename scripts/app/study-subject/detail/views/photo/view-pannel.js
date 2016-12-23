var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    download: false
};

exports.dataForTemplate = {
    photos: function(data) {
        var me = this,
            subject = data.subject;
        _.map(subject.coursePhotos, function(opt) {
            var photo = opt;
            photo.imageUrl = me.bindings.download.getFullUrl() + '?id=' + photo.attachmentId;
            return photo;
        });
        return subject.coursePhotos;
    }
};
