
exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntity = function() {
    return {
        state: this.bindings.state.data
    };
};

exports.getEntityModuleName = function(key) {
    var code = key;
    if (!key) code = 'default';
    return 'train/programme/preview/' + code;
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
