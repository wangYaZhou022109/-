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
