
exports.type = 'dynamic';

exports.bindings = {
    leftstate: true,
    expert: true
};

exports.events = {
    'click menu-*': 'showMenu',
    'click item-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.leftstate,
            expert = this.bindings.expert;
        state.data = {};
        state.data.id = expert.data.member.id;
        state.data.menu = menu || 'inviteanswer';
        state.data[menu] = true;
        state.changed();
    }
};
exports.getEntityModuleName = function(key) {
    var url = this.bindings.leftstate.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'ask/' + url;
};
exports.getEntity = function() {
    return {
        state: this.bindings.leftstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
