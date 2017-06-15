exports.title = function() {
    return this.renderOptions.name;
};

exports.bindings = {
    down: false,
};

exports.dataForTemplate = {
    url: function() {
        var attachmentId = this.renderOptions.attachmentId;
        return this.bindings.down.getFullUrl() + '?id=' + attachmentId;
    }
};
