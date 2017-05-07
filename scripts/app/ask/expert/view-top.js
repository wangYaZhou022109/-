exports.type = 'dynamic';

exports.bindings = {
    topstate: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.topstate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.topstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
