var $ = require('jquery');

exports.items = {
    'apply-topic': 'apply-topic',
    'my-topic': 'my-topic'
};

exports.buttons = [{
    text: '提交申请'
}];


exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(id) {
        $(this.$('item-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('tabs-cont-item-' + id)).addClass('active').siblings().removeClass('active');
    }
};
