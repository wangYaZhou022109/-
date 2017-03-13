exports.bindings = {
    download: false
};

exports.dataForTemplate = {
    url: function() {
        var url = this.bindings.download.getFullUrl();
        var imgId = this.module.renderOptions.section.attachmentId;
        return url + '?id=' + imgId;
    }
};
