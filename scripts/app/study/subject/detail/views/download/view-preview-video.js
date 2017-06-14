var plyr = require('plyr');
var url;
exports.title = function() {
    return this.renderOptions.name;
};

exports.bindings = {
    down: false,
};

exports.dataForTemplate = {
    url: function() {
        var attachmentId = this.renderOptions.attachmentId;
        if (!url) {
            url = this.bindings.down.getFullUrl() + '?id=' + attachmentId;
        }
        return url;
    }
};
exports.afterRender = function() {
    plyr.setup(this.$('course-video'), { autoplay: true });
};

exports.beforeRender = function() {
    return this.module.dispatch('getAttachment', { id: this.renderOptions.attachmentId })
    .then(function(data) {
        url = '/' + data[0].path + '?type=mp4';
    });
};
