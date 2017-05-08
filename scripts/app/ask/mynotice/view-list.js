exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/mynotice/' + url;
};
exports.getEntity = function() {
    var me = this;
    return {
        state: this.bindings.state.data,
        leftrefresh: function() {
            me.module.dispatch('leftrefresh');
        },
        bottomsrefresh: function() {
            me.module.dispatch('bottomsrefresh');
        },
        refresh: function() {
            me.module.dispatch('refresh');
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
