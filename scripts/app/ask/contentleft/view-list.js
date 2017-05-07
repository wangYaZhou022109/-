exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    var me = this;
    return {
        me: this.bindings.state,
        state: this.bindings.state.data,
        callback: me.module.renderOptions.callback
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
