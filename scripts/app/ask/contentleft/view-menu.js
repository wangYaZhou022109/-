var $ = require('jquery');
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
        $(this.$('menu-' + menu)).addClass('active').siblings().removeClass('active');
       // $(this.$('tabs-cont-item-' + menu)).addClass('active').siblings().removeClass('active');
        state.data = {};
        state.data.menu = menu || 'alldynamic';
        state.data[menu] = true;
        state.changed();
    }
};


exports.actions = {
    'click relatedtome*': 'relatedtome',
};

exports.dataForActions = {
    relatedtome: function(payload) {
        return payload;
    }
};
exports.actionCallbacks = {
    relatedtome: function(data) {
        var state = this.bindings.state,
            menu = 'relatedtome';
        state.data = {};
        if (typeof data[0] !== 'undefined') {
            if (data[0].concernList.length <= 0) {
                menu = 'attentionselection';
            }
            state.data.menu = menu;
            state.data[menu] = true;
            state.changed();
        }
    }
};
