var plyr = require('plyr'),
    url;
exports.title = function() {
    return this.renderOptions.name;
};

exports.bindings = {
    download: false,
};

exports.dataForTemplate = {
    url: function() {
        var attachmentId = this.renderOptions.attachmentId;
        if (!url) {
            url = this.bindings.download.getFullUrl() + '?id=' + attachmentId;
        }
        return url;
    }
};
exports.afterRender = function() {
    plyr.setup(this.$('course-audio'), { autoplay: true });
};

exports.beforeRender = function() {
    return this.module.dispatch('getAttachment', { id: this.renderOptions.attachmentId })
    .then(function(data) {
        url = '/' + data[0].path + '?type=mp4';
    });
};
