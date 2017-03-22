var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    modules: true
};


exports.getEntityModuleName = function(id, entity) {
    return 'home/default/' + entity.moduleHomeConfig.moduleCode;
};

exports.getEntity = function(id) {
    var moduleHomeConfig = _.find(this.bindings.modules.data, ['id', id]);
    return {
        moduleHomeConfig: moduleHomeConfig
    };
};

exports.dataForEntityModule = function(data) {
    return data;
};
