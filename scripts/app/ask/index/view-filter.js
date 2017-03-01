exports.bindings = {
    params: true,
    state: true
};

exports.events = {
    'click filter-menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu;
        state.data[menu] = true;
        state.changed();
    }
};
