exports.bindings = {
    state: true
};

exports.events = {
    'click middle-menu-*': 'showMenu',
    'click category-item-*': 'category'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu || 'contentleft';
        state.data[menu] = true;
        state.changed();
    },
    category: function() {
    }
};
