exports.items = {
    menu: 'menu'
};

exports.store = {
    models: {
        menus: { data: [] }
    },
    callbacks: {
        'app.changeMenu': function(payload) {
            var menus = this.models.menus;
            menus.data = payload.parent.children;
            menus.changed();

            this.module.dispatch('app.pushState', payload.current.uri);
        },

        'app.pushState': function(hash) {
            if (!this.models.menus.data.length) return;
            this.module.active(hash);
        }
    }
};

exports.mixin = {
    active: function(hash) {
        this.items.menu.active(hash);
    }
};

exports.components = [{
    id: 'sidebar-menu',
    name: 'perfect-scrollbar'
}];
