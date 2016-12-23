var $ = require('jquery');

exports.bindings = {
    params: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this,
            isOverdue = true;
        if (el === '1') {
            isOverdue = false;
        }
        me.module.dispatch('search', { isOverdue: isOverdue });
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
