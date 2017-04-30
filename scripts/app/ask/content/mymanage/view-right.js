exports.type = 'dynamic';

exports.bindings = {
    rightstate: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.rightstate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.rightstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
