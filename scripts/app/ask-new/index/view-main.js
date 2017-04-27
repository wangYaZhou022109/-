var $ = require('jquery');
exports.bindings = {
};
exports.events = {
    'click item-*': 'toggleItem',
    'click button-*': 'togglePage',
    'click icon-*': 'toggleIcon',
    'click report': 'showExport',
    'click discuss-*': 'discuss',
    'click selectquestion-*': 'showSlectdrop',
    'change selectquestion-*': 'hideSlectdrop'
};

exports.handlers = {
    discuss: function(id) {
        $(this.$('comment-reply-' + id)).toggleClass('show');
        $(this.$('comment-list-' + id)).toggleClass('hide');
    },
    toggleItem: function(id) {
        $(this.$('item-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('tabs-cont-item-' + id)).addClass('active').siblings().removeClass('active');
    },
    togglePage: function(id) {
        var div1;
        var div2;
        var div3;
        div1 = $(this.$('page1'));
        div2 = $(this.$('page2'));
        div3 = $(this.$('page3'));
        if (id === '1') {
            div2.show().siblings().hide();
        }
        if (id === '2') {
            div1.show().siblings().hide();
        }
        if (id === '3') {
            div3.show().siblings().hide();
        }
    },
    toggleIcon: function(id) {
        var that;
        that = $(this.$('icon-' + id));
        that.toggleClass('icon-opacity0');
    },
    showExport: function() {
        var model = this.module.items['ask-new/index/export'];
        this.app.viewport.modal(model);
    },
    showSlectdrop: function(id) {
        $(this.$('selectquestion-' + id)).parent().css('overflow', 'inherit');
        $(this.$('selectdrop-' + id)).css('margin-top', '-.5em');
    },
    hideSlectdrop: function(id) {
        $(this.$('selectquestion-' + id)).parent().css('overflow', 'hidden');
        $(this.$('selectdrop-' + id)).css('margin-top', '0');
    }
};
