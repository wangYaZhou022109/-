exports.type = 'dynamic';

exports.bindings = {
    middlestate: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.middlestate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.middlestate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
