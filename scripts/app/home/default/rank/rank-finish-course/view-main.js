exports.bindings = {
    studyRank: true
};

exports.dataForTemplate = {
    moduleHomeConfig: function(data) {
        var moduleHomeConfig = data.moduleHomeConfig || {};
        moduleHomeConfig = this.module.renderOptions.rankModuleConfig;
        return moduleHomeConfig;
    }
};
