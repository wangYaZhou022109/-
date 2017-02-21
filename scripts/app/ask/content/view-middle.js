exports.bindings = {
    state: true,
    popupstate: true
};

exports.events = {
    'click middle-menu-*': 'showMenu',
    'click follow-*': 'follow'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu || 'contentleft';
        state.data[menu] = true;
        state.changed();
    },
    follow: function(payload) {
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.title = '我的关注';
        state.data.menu = 'mynotice';
        state.data[payload] = true;
        state.changed();
    }
};
