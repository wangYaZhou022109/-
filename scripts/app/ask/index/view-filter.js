exports.bindings = {
    params: true,
    state: true
};

exports.events = {
    'click filter-menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        console.log('this is showMenu!');
        var state = this.bindings.state;
        console.log(state);
        state.data = {};
        state.data.menu = menu || 'content';
        state.data[menu] = true;
        state.changed();
    }
};
