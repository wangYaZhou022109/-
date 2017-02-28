exports.type = 'dynamic';
exports.bindings = {
    state: true
};

exports.events = {
    'click menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu || 'news';
        state.data[menu] = true;
        state.changed();
    }
};
