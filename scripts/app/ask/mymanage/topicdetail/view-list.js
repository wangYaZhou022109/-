exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/mymanage/topicdetail/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.state
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
