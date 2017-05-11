exports.title = function() {
    return this.renderOptions.name;
};

exports.bindings = {
    download: false,
};

exports.dataForTemplate = {
    url: function() {
        var attachmentId = this.renderOptions.attachmentId;
        return this.bindings.download.getFullUrl() + '?id=' + attachmentId;
    }
};
