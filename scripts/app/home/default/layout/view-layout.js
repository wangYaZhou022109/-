var _ = require('lodash/collection'),
    maps = require('./app/util/maps');
exports.bindings = {
    contents: true,
    down: false
};

exports.dataForTemplate = {
    moduleHomeConfig: function(data) {
        var moduleHomeConfig = data.moduleHomeConfig || {};
        moduleHomeConfig = this.module.renderOptions.moduleHomeConfig;
        return moduleHomeConfig;
    },
    contents: function(data) {
        var array = {},
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.contents, function(content, i) {
            var r = content,
                imageUrl = maps['home-default-image'][r.dataType],
                dataUrl = maps['home-data-url'][r.dataType];
            if (r.dataImage) {
                imageUrl = downUrl + '?id=' + r.dataImage;
            }
            if (r.image) {
                imageUrl = downUrl + '?id=' + r.image;
            }
            r.imageUrl = imageUrl;
            r.dataUrl = dataUrl + r.id;
            array[i + 1] = r;
        });
        return array;
    }
};
