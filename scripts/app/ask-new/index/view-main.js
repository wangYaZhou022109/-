var $ = require('jquery');

exports.events = {
    'click item-*': 'toggleItem',
    'click button-*': 'togglePage',
    'click icon-*': 'toggleIcon'
};

exports.handlers = {
    toggleItem: function(id) {
        $(this.$('item-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('tabs-cont-item-' + id)).addClass('active').siblings().removeClass('active');
    },
    togglePage: function(id) {
        var div1;
        var div2;
        var div3;
        var dv;
        div1 = $(this.$('button-1')).parent('div').parent('div');
        div2 = $(this.$('button-2')).parent('div').parent('div');
        dv = $(this.$('button-3')).parent('div').parent('div').parent('div');
        div3 = $(dv.children('div')[2]);
        if (id === '1') {
            div1.hide();
            div2.show();
            div3.hide();
        }
        if (id === '2') {
            div1.show();
            div2.hide();
            div3.hide();
        }
        if (id === '3') {
            div1.hide();
            div2.hide();
            div3.show();
        }
    },
    toggleIcon: function(id) {
        var that;
        that = $(this.$('icon-' + id));
        that.toggleClass('icon-opacity0');
    }
};
