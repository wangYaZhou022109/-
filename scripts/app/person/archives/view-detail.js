var _ = require('lodash/collection'),
    $ = require('jquery'),
    D = require('drizzlejs');

exports.bindings = {
    detailMenu: true
};

exports.events = {
    'click detail-*': 'showDetail'
};

exports.afterRender = function() {
    var el = this.$('tableDiv'),
        me = this,
        menus = this.bindings.detailMenu.data,
        region = new D.Region(this.app, this.module, el);
    region.show('person/archives/detail/course', { type: menus[0].id });
    $(me.$('detail-' + menus[0].id)).addClass('active');
};

exports.handlers = {
    showDetail: function(id) {
        var menus = this.bindings.detailMenu.data,
            me = this,
            el = this.$('tableDiv'),
            region = new D.Region(this.app, this.module, el, id),
            item = '';
        _.forEach(menus, function(menu) {
            if (menu.id === id) {
                $(me.$('detail-' + menu.id)).addClass('active');
                item = menu.item;
            } else {
                $(me.$('detail-' + menu.id)).removeClass('active');
            }
        });
        region.show(item, { type: id });
    }
};
