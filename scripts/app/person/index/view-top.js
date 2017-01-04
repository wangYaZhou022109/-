exports.bindings = {
    state: true
};

exports.events = {
    'click identity-*': 'showIdentity'
};

exports.handlers = {
    showIdentity: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu;
        state.data[menu] = true;
        state.changed();
    }
};
