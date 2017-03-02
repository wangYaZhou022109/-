var D = require('drizzlejs');
var $ = require('jquery');

exports.bindings = {
    popupstate: true,
    follow: true
};

exports.events = {
    'click middle-menu-*': 'showMenu',
    'click follow-*': 'follow'
};

exports.handlers = {
    showMenu: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0].children[0];
        region = new D.Region(this.app, this.module, el);
        region.show('ask/' + id);
    },
    follow: function() {
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.title = '我的关注';
        state.hidden = true;
        state.data.menu = 'mynotice/topic';
        state.data.mynotice = true;
        state.changed();
    }
};
