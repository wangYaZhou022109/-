exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    return 'train/register/' + key;
};

exports.getEntity = function() {
    return {
        state: this.bindings.state.data
    };
};

exports.dataForEntityModule = function(entity) {
    var me = this;
    return {
        state: entity.state,
        callback: function(data) {
            me.module.dispatch('refesh', data);
        }
    };
};
