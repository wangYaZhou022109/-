var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.type = 'dynamic';

exports.bindings = {
    state: true,
    menus: true,
    msgCount: true
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
        if (key === 'atme') {
            url = 'notice';
        }
    }
    return 'home/message/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.state.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};

exports.dataForTemplate = {
    menus: function(data) {
        var msgCount = data.msgCount,
            menus = data.menus;
        if (msgCount) {
            _.map(menus, function(r) {
                if (r.id === '0') {
                    if (msgCount.innerCount > 0) {
                        D.assign(r, { count: msgCount.innerCount });
                    } else if (msgCount.innerCount > 99) {
                        D.assign(r, { count: '99+' });
                    }
                } else if (r.id === '1') {
                    if (msgCount.todoCount > 0) {
                        D.assign(r, { count: msgCount.todoCount });
                    } else if (msgCount.todoCount > 99) {
                        D.assign(r, { count: '99+' });
                    }
                } else if (r.id === '2') {
                    if (msgCount.atCount > 0) {
                        D.assign(r, { count: msgCount.atCount });
                    } else if (msgCount.atCount > 99) {
                        D.assign(r, { count: '99+' });
                    }
                }
                return r;
            });
        }
        return menus;
    }
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
