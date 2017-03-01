
exports.type = 'dynamic';

exports.events = {
};

exports.handlers = {
};


exports.bindings = {
    activeexpertstate: true
};

exports.getEntityModuleName = function(key) {
    return 'ask/' + key;
};
exports.getEntity = function() {
    return {
        state: this.bindings.activeexpertstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
