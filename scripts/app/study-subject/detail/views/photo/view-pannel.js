var _ = require('lodash/collection');
exports.bindings = {
    region: false,
    subject: false,
    download: false,
    coursePhoto: true
};

exports.dataForTemplate = {
    photos: function(data) {
        var me = this,
            coursePhotos = data.coursePhoto;
        _.map(coursePhotos, function(opt) {
            var photo = opt;
            photo.imageUrl = me.bindings.download.getFullUrl() + '?id=' + photo.attachmentId;
            return photo;
        });
        return coursePhotos;
    }
};

exports.events = {
    'click turnPage-*': 'turnPage'
};

exports.handlers = {
    turnPage: function(data) {
        this.module.dispatch('turnPage', data);
    }
};
