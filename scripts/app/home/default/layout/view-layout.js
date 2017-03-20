exports.bindings = {
    contents: true
};

exports.dataForTemplate = {
    moduleHomeConfig: function(data) {
        var moduleHomeConfig = data.moduleHomeConfig || {};
        moduleHomeConfig = this.module.renderOptions.moduleHomeConfig;
        return moduleHomeConfig;
    }
};
