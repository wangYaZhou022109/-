var $ = require('jquery');

exports.events = {
    'click item-*': 'toggleItem',
    'keypress searchContent': 'search',
    'click search': 'searchBtn',
    'click sort*': 'sort'
};

exports.handlers = {
    toggleItem: function(id, e, obj) {
        $(obj).addClass('active').siblings().removeClass('active');
        this.module.dispatch('search', { categoryId: '' });
    },
    search: function(e, item) {
        var value = $.trim(item.value);
        if (e.keyCode !== 13) return false;
        return this.module.dispatch('search', { searchContent: value });
    },
    searchBtn: function() {
        var value = $.trim(this.$('searchContent').value);
        return this.module.dispatch('search', { searchContent: value });
    }
};

