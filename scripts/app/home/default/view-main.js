var _ = require('lodash/collection'),
    D = require('drizzlejs');
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

exports.dataForTemplate = {
    modules: function(data) {
        var modules = data.modules;
        if (!this.app.global.currentUser.organization) {
            modules = _.map(modules, function(p) {
                if (p.moduleCode === 'rank') {
                    if (p.regionCode !== '') {
                        D.assign(p, { enableHomeBrowse: 1 });
                        _.map(JSON.parse(p.regionCode), function(r) {
                            if (r.enableHomeBrowse === 0) {
                                D.assign(p, { enableHomeBrowse: 0 });
                            }
                        });
                    }
                }
                return p;
            });
            modules = _.filter(modules, ['enableHomeBrowse', 0]);
        }
        return modules;
    }
};
