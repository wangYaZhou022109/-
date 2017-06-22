var _ = require('lodash/collection'),
    $ = require('jquery');

// exports.type = 'form';
// exports.large = true;

exports.bindings = {
    identies: true,
    inners: true
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

exports.dataForTemplate = {
    inners: function(data) {
        var pageNum = this.bindings.inners.getPageInfo().page;
        _.map(data.inners || [], function(item, i) {
            var r = item;
            r.i = i + 1 + ((pageNum - 1) * 5);
        });
        return data.inners;
    },
    identies: function(data) {
        var pageNum = this.bindings.identies.getPageInfo().page;
        _.map(data.identies || [], function(item, i) {
            var r = item;
            r.i = i + 1 + ((pageNum - 1) * 5);
        });
        return data.identies;
    }
};

// exports.components = [{
//     id: 'innerPager', name: 'pager', options: { model: 'inners' }
// }, {
//     id: 'identyPager', name: 'pager', options: { model: 'identies' }
// }];

exports.components = function() {
    var components = [];
    components.push({ id: 'innerPager', name: 'pager', options: { model: 'inners' } });
    components.push({ id: 'identyPager', name: 'pager', options: { model: 'identies' } });
    return components;
};


