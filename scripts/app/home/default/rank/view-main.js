var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    moduleHomeConfig: true
};

exports.getEntityModuleName = function(type) {
    return 'home/default/rank/' + type;
};

exports.getEntity = function(code) {
    var moduleHomeConfig = this.bindings.moduleHomeConfig.data,
        rankModule = _.find(JSON.parse(moduleHomeConfig.regionCode), ['moduleCode', code]);
    return {
        rankModule: rankModule
    };
};
exports.dataForEntityModule = function(data) {
    return data;
};
exports.dataForTemplate = {
    rankModules: function(data) {
        var moduleHomeConfig = this.module.renderOptions.moduleHomeConfig,
            rankModules = data.rankModules || {};
        rankModules = _.orderBy(JSON.parse(moduleHomeConfig.regionCode), 'sort');
        return rankModules;
    }
};
