exports.type = 'dynamic';
exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    return 'full-text-search/index/' + key;
};

exports.getEntity = function() {
    var me = this;
    return {
        state: this.bindings.state.data,
        callback: function(option) {
            me.module.dispatch('changeSearchType', option);
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
