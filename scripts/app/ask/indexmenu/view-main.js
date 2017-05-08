var D = require('drizzlejs');
var $ = require('jquery');

exports.bindings = {
    follow: true,
    topicmanage: true
};

exports.events = {
    'click middle-menu-*': 'showMenu',
    'click follow-*': 'follow'
};

exports.handlers = {
    showMenu: function(id, e, target) {
        var region;
        var el = $(target).parents('.page-side')[0].nextElementSibling;
        $(window).unbind('scroll');
        region = new D.Region(this.app, this.module, el);
        region.show('ask/' + id);
    },
    follow: function(payload) {
        var me = this;
        // $(window).unbind('scroll');
        // this.app.viewport.modal(this.module.items['ask/mynotice'], { id: payload });
        this.app.viewport.modal(this.module.items['ask/mynotice'],
            {
                leftrefresh: function() {
                    me.module.dispatch('leftrefresh');
                },
                bottomsrefresh: function() {
                    me.module.dispatch('bottomsrefresh');
                },
                refresh: function() {
                    me.module.dispatch('refresh');
                },
                id: payload
            }
        );
    }
};
