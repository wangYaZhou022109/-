exports.bindings = {
    state: true,
    attention: true
};

exports.events = {
    'click menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu || 'alldynamic';
        state.data[menu] = true;
        if (menu === 'relatedtome') {
            if (typeof this.bindings.attention.data.concernList === 'undefined'
            || this.bindings.attention.data.concernList.length === 0) {
                state.data.menu = 'attentionselection';
            }
        }
        state.changed();
    }
};
