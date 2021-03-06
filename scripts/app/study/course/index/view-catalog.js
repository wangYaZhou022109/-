var _ = require('lodash/collection');
exports.bindings = {
    categories: true,
    menu2: true,
    search: true,
    hotTopicIds: 'changeTopics',
    topics: true
};

exports.events = {
    'click item-1-*': 'selectMenu1',
    'click item-2-*': 'selectMenu2'
};

exports.handlers = {
    selectMenu2: function(id) {
        this.module.dispatch('search', { menu2: id });
    },
    selectMenu1: function(id) {
        return this.chain([
            this.module.dispatch('selectMenu1', { id: id }),
            this.module.dispatch('search', { menu1: id, menu2: null })
        ]);
    }
};
exports.dataForTemplate = {
    menus: function(data) {
        // 一级导航 二级导航
        var select1 = data.search.menu1 || '';
        var list = this.bindings.categories.findLevel(1);
        list.unshift({ name: '全部', id: '' });
        list.forEach(function(m) {
            var obj = m || {};
            delete obj.active;
            if (select1 === obj.id) obj.active = true;
        });
        return list;
    },
    menus2: function(data) {
        var select2 = data.search.menu2;
        var list = data.menu2;
        list.forEach(function(m) {
            var obj = m || {};
            delete obj.active;
            if (select2 === obj.id) obj.active = true;
        });
        return list;
    }
};
exports.changeTopics = function() {
    var ids = _.map(this.bindings.hotTopicIds.data, 'id');
    if (ids.length > 0) {
        this.module.dispatch('searchTopics', { ids: ids.join() });
    }
};
