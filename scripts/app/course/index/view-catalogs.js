exports.bindings = {
    categories: true
};

exports.dataForTemplate = {
    categories: function() {
        var categories = this.bindings.categories,
            fillChild = function(pid) {
                var menus = categories.filterPid(pid);
                menus.forEach(function(obj) {
                    menus.children = fillChild(obj.id);
                });
                return menus;
            };
        return fillChild(null);
    }
};

exports.events = {
    'click closeCatalog': 'closeCatalog'
};

exports.handlers = {
    closeCatalog: function() {
        var ele = this.$$('.catalog-view')[0];
        ele.hidden = !ele.hidden;
    }
};
