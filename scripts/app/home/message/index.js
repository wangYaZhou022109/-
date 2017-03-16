var $ = require('jquery');

exports.title = '我的消息';

exports.items = {
    notice: 'notice',
    'to-do': 'to-do',
    with: 'with'
};

exports.events = {
    'click item-*': 'showItem'
};

exports.handlers = {
    showItem: function(id) {
        $(this.$('item-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('tabs-cont-item-' + id)).addClass('active').siblings().removeClass('active');
    }
};
