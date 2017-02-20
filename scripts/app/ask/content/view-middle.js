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
       // this.module.items.popup.$$('.shield')[0].hidden = false;
       // this.module.items.popup.$$('.catalog-view')[0].hidden = false;
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.menu = payload || 'contentleft';
        state.data[payload] = true;
        state.changed();
    }
};
