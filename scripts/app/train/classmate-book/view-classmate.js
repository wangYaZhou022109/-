var _ = require('lodash/collection');

exports.bindings = {
    classId: true,
    list: true,
    menu: true,
    state: true
};

exports.events = {
    'click return': 'toggleActive',
    'click menu-*': 'menuBySelect'
};

exports.handlers = {
    toggleActive: function() {
        var classId = this.bindings.classId.data.classId;
        this.app.show('content', 'train/class-detail', { classId: classId });
    },
    menuBySelect: function(id) {
        this.module.dispatch('list', id);
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var pageNum = this.bindings.list.getPageInfo().page;
        _.map(data.list || [], function(cinfo, i) {
            var e = cinfo;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return data.list;
    },
    menu: function(data) {
        var menu = data.menu || [],
            staste = this.bindings.state.data || {};
        if (menu) {
            _.map(menu, function(m) {
                var d = m;
                if (d.id === staste) {
                    d.active = true;
                }
            });
        }
        return menu;
    },
    rest: function() {
        var state = this.bindings.state.data || {};
        if (state === '0') {
            return true;
        }
        return false;
    }
};
