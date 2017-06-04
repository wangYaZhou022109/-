exports.type = 'dynamic';

exports.bindings = {
    bottomstate: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.bottomstate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.bottomstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
