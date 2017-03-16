
exports.type = 'dynamic';

exports.events = {
};

exports.handlers = {
    expert: true
};


exports.bindings = {
    relevantexperts: true
};

exports.getEntityModuleName = function(key) {
    return 'ask/' + key;
};
exports.getEntity = function() {
    return {
        state: this.bindings.relevantexperts.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
