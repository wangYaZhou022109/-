exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    var str = '';
    if (key === 'all-dynamic' || key === 'expert-sharing' || key === 'related-to-me') {
        str = 'ask/content/' + key;
    } else {
        str = 'ask/' + key;
    }
    return str;
};
exports.getEntity = function() {
    return {
        state: this.bindings.state.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
