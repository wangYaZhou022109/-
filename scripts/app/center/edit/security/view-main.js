var $ = require('jquery');

exports.type = 'dynamic';

exports.bindings = {
    member: true
};

exports.getEntityModuleName = function() {
    return 'center/edit/security/phone';
};
exports.getEntity = function() {
    return {
        member: this.bindings.member.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(id) {
        $(this.$('item-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('tabs-cont-item-' + id)).addClass('active').siblings().removeClass('active');
    }
};
