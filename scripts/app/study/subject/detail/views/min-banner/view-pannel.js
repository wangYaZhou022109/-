exports.bindings = {
    region: false,
    subject: false
};

exports.dataForTemplate = {
    imageUrl: function(data) {
        var contentValue = data.region.regionModule.contentValue,
            imageUrl;
        if (contentValue) imageUrl = this.bindings.down.getFullUrl() + '?id=' + contentValue;
        return imageUrl;
    }
};
