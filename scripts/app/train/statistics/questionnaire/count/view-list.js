exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'train/statistics/questionnaire/count/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.state
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
