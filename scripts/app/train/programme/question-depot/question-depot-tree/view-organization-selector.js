exports.type = 'dynamic';

exports.getEntity = function() {
    return {};
};

exports.getEntityModuleName = function() {
    return 'exam/question-depot/organization-selector';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function(organization) {
            return me.module.dispatch('changeOrganization', organization);
        }
    };
};
