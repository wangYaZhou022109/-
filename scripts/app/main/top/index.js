var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    nav: 'nav',
    shortcut: 'shortcut',
    logo: 'logo',
    'main/menu': { region: 'top-tree', isModule: true }
};

exports.store = {
    models: {
        setting: { url: '../system/setting' },
        menus: { url: '../system/menu/member-menu' },
        extention: { url: '../human/extention/granted' },
        state: { mixin: {
            init: function(data) {
                var d = this.data = { map: {}, list: [] };
                _.map(data, function(item) {
                    d.map[item.id] = D.assign({ children: [] }, item);
                });

                _.map(data, function(item) {
                    if (!item.parentId || !d.map[item.parentId]) {
                        d.list.push(d.map[item.id]);
                    } else {
                        d.map[item.parentId].children.push(d.map[item.id]);
                    }
                });

                this.changed();
            },

            active: function(node) {
                var n = node,
                    old = this.data.active;

                if (old && old.id === n.id) return false;
                if (old) old.active = false;

                this.data.active = n;
                n.active = true;

                this.changed();
                return true;
            }
        } }
    },

    callbacks: {
        init: function() {
            var setting = this.models.setting,
                menus = this.models.menus,
                state = this.models.state,
                extention = this.models.extention,
                obj = this.app.global.setting = {},
                extentionObj = this.app.global.extention = {};

            this.get(setting).then(function() {
                _.map(setting.data, function(v) { obj[v.key] = v.value; });
            });

            this.get(extention).then(function() {
                _.map(extention.data, function(value) {
                    if (extentionObj[value.dataType]) {
                        extentionObj[value.dataType].push(value);
                    } else {
                        extentionObj[value.dataType] = [value];
                    }
                });
            });


            return this.get(menus).then(function() {
                state.init(menus.data);
            });
        },

        'app.pushState': function(hash) {
            this.app.global.uri = hash;
            this.chain(this.models.state.data.map || this.module.dispatch('init'), function() {
                var map = this.models.state.data.map,
                    current,
                    parent;

                current = _.find(this.models.menus.data, function(item) {
                    return item.uri === hash && item.parentId;
                });
                if (!current) return;

                parent = map[current.parentId];
                if (!parent) return;

                while (parent.parentId) parent = map[parent.parentId];
                if (this.models.state.active(parent)) {
                    this.app.dispatch('changeMenu', { parent: parent, current: current });
                }
            });
        }
    }
};
