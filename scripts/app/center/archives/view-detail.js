var _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    detailMenu: true,
    state: true,
};

exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'center/archives/' + url;
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
    'click detail-*': 'showDetail'
};

exports.handlers = {
    showDetail: function(id) {
        var state = this.bindings.state,
            menus = this.bindings.detailMenu.data,
            menu = menus[id].url;
        _.forEach(menus, function(m) {
            var obj = m;
            if (obj.id === id) {
                obj.active = true;
            } else {
                obj.active = false;
            }
        });
        state.data = {};
        state.params = { type: id };
        state.data.menu = menu;
        state.data.menuId = id;
        state.data[menu] = true;
        state.changed();
    }
};
