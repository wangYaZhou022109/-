
exports.type = 'dynamic';

exports.events = {
};

exports.handlers = {
};


exports.bindings = {
    hottopicstate: true
};

exports.getEntityModuleName = function(key) {
    return 'ask/' + key;
};
exports.getEntity = function() {
    return {
        state: this.bindings.hottopicstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
