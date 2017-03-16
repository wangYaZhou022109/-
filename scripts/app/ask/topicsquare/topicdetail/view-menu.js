exports.type = 'dynamic';
exports.bindings = {
    state: true,
    topicdetail: true
};

exports.events = {
    'click menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var topicdetail = this.bindings.topicdetail;
        var state = this.bindings.state;
        state.data = {};
        state.data.topicid = topicdetail.data.id;
        state.data.menu = menu || 'news';
        state.data[menu] = true;
        state.changed();
    }
};
