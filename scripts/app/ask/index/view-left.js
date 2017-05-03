exports.type = 'dynamic';

exports.bindings = {
    leftstate: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.leftstate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.leftstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
