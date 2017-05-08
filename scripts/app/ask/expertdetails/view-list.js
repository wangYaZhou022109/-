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
        state: this.bindings.state.data,
        callback: function() {
            me.module.dispatch('refresh');
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};

exports.events = {
    'click menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.state,
            id = this.bindings.state.data.id;
        state.data = {};
        state.data.id = id;
        state.data.menu = menu || 'myanswer';
        state.data[menu] = true;
        state.changed();
    }
};
