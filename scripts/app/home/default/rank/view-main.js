var _ = require('lodash/collection');
exports.type = 'dynamic';

exports.getEntityModuleName = function(type) {
    return 'home/default/rank/' + type;
};

exports.getEntity = function(code) {
    var moduleHomeConfig = this.module.renderOptions.moduleHomeConfig,
        rankModules = JSON.parse(moduleHomeConfig.regionCode),
        rankModuleConfig = _.find(rankModules, ['moduleCode', code]);
    return {
        moduleHomeConfig: moduleHomeConfig,
        rankModuleConfig: rankModuleConfig
    };
};

exports.dataForTemplate = {
    rankModules: function(data) {
        var moduleHomeConfig = this.module.renderOptions.moduleHomeConfig,
            rankModules = data.rankModules || {};
        rankModules = JSON.parse(moduleHomeConfig.regionCode);
        return rankModules;
    }
};
