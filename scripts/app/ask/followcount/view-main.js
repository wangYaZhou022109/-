var D = require('drizzlejs');
var $ = require('jquery');

exports.bindings = {
    follow: true
};

exports.events = {
};

exports.handlers = {
    showMenu: function(id, e, target) {
        var region;
        var el = $(target).parents('.page-side')[0].nextElementSibling;
        // console.log(el);
        region = new D.Region(this.app, this.module, el);
        region.show('ask/' + id);
    },
    follow: function() {
        var state = this.bindings.popupstate;
        state.data = {};
        state.data.title = '我的关注';
        state.data.menu = 'mynotice';
        state.data.mynotice = true;
        state.changed();
    }
};
