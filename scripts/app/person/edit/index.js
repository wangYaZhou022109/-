var $ = require('jquery');

exports.items = {
    'base-info': 'base-info',
    security: 'security'
};

exports.buttons = [{
    text: '保存'
}];

exports.large= 'true';

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(id) {
        console.log($(this.$('item-' + id)));
        $(this.$('item-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('tabs-cont-item-' + id)).addClass('active').siblings().removeClass('active');
    }
};
