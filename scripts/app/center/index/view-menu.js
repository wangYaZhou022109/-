var _ = require('lodash/collection');
var $ = require('jquery');

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
    return 'center/' + url;
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
    'click switch-*': 'switchMenu',
    'click toggle-menu-*': 'toggleMenuChild'
};

exports.handlers = {
    switchMenu: function(menuId) {
        var state = this.bindings.state,
            id = this.bindings.state.data.id,
            menu = '',
            menuIds = menuId.split('-');
        if (menuIds.length > 1) {
            menu = this.bindings.menus.data[menuIds[0]].childs[menuIds[1]].url;
        } else {
            menu = this.bindings.menus.data[menuId].url;
        }
        state.data = {};
        state.data.id = id;
        state.data.menu = menu;
        state.data[menu] = true;
        state.changed();
    },
    toggleMenuChild: function(id, el, target) {
        $(target).toggleClass('show-menu');
    }
};


exports.dataForTemplate = {
    menus: function() {
        var menus = this.bindings.menus.data,
            state = this.bindings.state.data;
        _.forEach(menus, function(m) {
            var obj = m;
            if (obj.url === state.menu) {
                obj.current = true;
            } else {
                obj.current = false;
            }
            if (obj.childs) {
                _.forEach(obj.childs, function(child) {
                    var c = child;
                    if (c.url === state.menu) {
                        c.current = true;
                    } else {
                        c.current = false;
                    }
                });
            }
        });
        return menus;
    }
};
