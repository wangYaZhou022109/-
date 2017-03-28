var _ = require('lodash/collection');
exports.bindings = {
    contents: true
};

exports.dataForTemplate = {
    moduleHomeConfig: function(data) {
        var moduleHomeConfig = data.moduleHomeConfig || {};
        moduleHomeConfig = this.module.renderOptions.moduleHomeConfig;
        return moduleHomeConfig;
    },
    contents: function(data) {
        var array = {};
        _.map(data.contents, function(content, i) {
            array[i + 1] = content;
        });
        return array;
    }
};
