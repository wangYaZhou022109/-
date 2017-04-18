var _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    state: true,
    menus: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'center/answer/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.state.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};

exports.events = {
    'click switch-*': 'switchMenu'
};

exports.handlers = {
    switchMenu: function(menuId) {
        var state = this.bindings.state,
            id = this.bindings.state.data.id,
            menus = this.bindings.menus.data,
            menu = '';
        menu = this.bindings.menus.data[menuId].url;
        _.forEach(menus, function(m) {
            var obj = m;
            if (obj.id === menuId) {
                obj.current = true;
            } else {
                obj.current = false;
            }
        });
        state.data = {};
        state.data.id = id;
        state.data.menu = menu;
        state.data.menuId = menuId;
        state.data[menu] = true;
        state.changed();
    }
};
