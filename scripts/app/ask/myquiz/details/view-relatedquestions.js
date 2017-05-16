
exports.type = 'dynamic';
exports.bindings = {
    state: false,
    details: true,
    question: true,
};
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
