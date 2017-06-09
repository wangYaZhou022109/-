var $ = require('jquery');
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
        $(window).unbind('scroll');
        state.data = {};
        state.data.topicid = topicdetail.data.id;
        state.data.menu = menu || 'news';
        state.data[menu] = true;
        state.changed();
    }
    // showMenu: function(menu) {
    //     var state = this.bindings.state;
    //     var topicdetail = this.bindings.topicdetail;
    //     $(window).unbind('scroll');
    //     $(this.$('menu-' + menu)).addClass('active').siblings().removeClass('active');
    //    // $(this.$('tabs-cont-item-' + menu)).addClass('active').siblings().removeClass('active');
    //     state.data = {};
    //     state.data.topicid = topicdetail.data.id;
    //     state.data.menu = menu || 'news';
    //     state.data[menu] = true;
    //     state.changed();
    // }
};
