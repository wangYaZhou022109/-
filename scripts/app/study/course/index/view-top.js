var $ = require('jquery');

exports.events = {
    'click item-*': 'toggleItem',
    'keypress searchTitle': 'search',
    'click searchTitleBtn': 'searchBtn',
    'click sort*': 'sort',
};

exports.handlers = {
    toggleItem: function(id, e, obj) {
        $(obj).addClass('active').siblings().removeClass('active');
        this.module.dispatch('search', { categoryId: '' });
    },
    search: function(e, item) {
        if (e.keyCode !== 13) return false;
        return this.module.dispatch('search', { searchContent: item.value });
    },
    searchBtn: function() {
        var value = this.$('searchTitle').value;
        return this.module.dispatch('search', { searchContent: value });
    }
};

