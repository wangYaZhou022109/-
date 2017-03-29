
exports.type = 'dynamic';

exports.events = {
};

exports.handlers = {
};


exports.bindings = {
    relatedquestions: true
};

exports.getEntityModuleName = function(key) {
    return 'ask/' + key;
};
exports.getEntity = function() {
    return {
        state: this.bindings.relatedquestions.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
