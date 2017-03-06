var _ = require('lodash/collection'),
    $ = require('jquery'),
    D = require('drizzlejs');

exports.bindings = {
    detailMenu: true
};

exports.events = {
    'click item-*': 'showCont'
};

exports.handlers = {
    showCont: function(id) {
        console.log('aaa');
        var menus = this.bindings.detailMenu.data,
            me = this,
            el = this.$('tabsCont'),
            region = new D.Region(this.app, this.module, el, id),
            item = '';
        _.forEach(menus, function(menu) {
            if (menu.id === id) {
                $(me.$('item-' + menu.id)).addClass('active');
                item = menu.item;
            } else {
                $(me.$('item-' + menu.id)).removeClass('active');
            }
        });
        region.show(item, { type: id });
    }
};

exports.afterRender = function() {
    var el = this.$('tabsCont'),
        me = this,
        menus = this.bindings.detailMenu.data,
        region = new D.Region(this.app, this.module, el);
    region.show('person/demand/cont', { type: menus[0].id });
    $(me.$('item-' + menus[0].id)).addClass('active');
};
