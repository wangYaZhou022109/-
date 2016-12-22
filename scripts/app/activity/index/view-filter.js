var $ = require('jquery');

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        $(this.$('item-' + el)).addClass('active').siblings().removeClass('active');
    }
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            name: $(this.$$('[name="activity-name"]')).val()
        };
    }
};
