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
    var me = this;
    return {
        state: this.bindings.middlestate.data,
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
