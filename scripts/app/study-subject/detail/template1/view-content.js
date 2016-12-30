exports.type = 'dynamic';
exports.bindings = {
    layout: true,
    regions: true,
    subject: false,
    state: false
};

exports.getEntityModuleName = function(key) {
    return 'study-subject/detail/views/' + key;
};

exports.getEntity = function(key) {
    var region = this.bindings.regions.findByModuleCode(key),
        subject = this.bindings.subject.data,
        state = this.bindings.state.data;
    return {
        region: region,
        subject: subject,
        state: state
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
