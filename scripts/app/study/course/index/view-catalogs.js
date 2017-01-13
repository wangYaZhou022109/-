exports.bindings = {
    categories: true
};

exports.dataForTemplate = {
    categories: function() {
        var categories = this.bindings.categories,
            fillChild = function(pid) {
                var menus = categories.filterPid(pid);
                menus.forEach(function(obj) {
                    var r = obj;
                    r.children = fillChild(obj.id);
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
        this.$$('.catalog-view')[0].hidden = true;
    }
};
