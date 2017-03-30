exports.bindings = {
    menus: true,
    navs: true
};

exports.dataForTemplate = {
    menus: function(data) {
        return data.menus;
    }
};

exports.events = {
    'click menu-*': 'showContent'
};

exports.handlers = {
    showContent: function(id, e, element) {
        var url = element.getAttribute('href').slice(2),
            shortcutView = this.module.items.shortcut;
        if (url === 'home') {
            url = url + '/org/' + shortcutView.$('orgId').value;
            this.app.navigate(url, true);
        }
        this.app.navigate(url, true);
    }
};
