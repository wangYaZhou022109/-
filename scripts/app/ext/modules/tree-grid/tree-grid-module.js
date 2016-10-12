var D = require('drizzlejs'),
    E = require('../module-seperated-template-engine'),
    L = require('../module-seperated-loader'),
    _ = require('lodash/collection'),
    $ = require('jquery'),
    TreeGridModule,
    setOptions, viewTitle, viewToolbox;

viewTitle = {
    bindings: {
        state: true
    },

    events: {
        'click toggleTree': 'toggleTree'
    },

    handlers: {
        toggleTree: function() {
            $(this.module.$('contentLeft')).toggleClass('phone-tree-opend');
        }
    }
};

viewToolbox = {
    bindings: {
        state: true,
        search: true
    },

    dataForTemplate: {
        tags: function(data) {
            return _.map(data.search, function(v, k) {
                return { id: k + v.id, text: v.text };
            });
        }
    },

    events: {
        'click search': 'showSearch'
    },

    handlers: {
        showSearch: function() {
            this.app.viewport.popup(this.module.items[this.module.options.searchView]);
        }
    },

    actions: {
        'change tags': 'removeSearchOption'
    },

    dataForActions: {
        removeSearchOption: function() {
            return this.components.tags.getValue();
        }
    },

    components: [{
        id: 'tags',
        name: 'selectize',
        options: {
            plugins: ['remove_button']
        }
    }],

    afterRender: function() {
        var me = this,
            el;
        if (!this.selectizeListener) {
            this.selectizeListener = function(e) {
                if ($(e.target).hasClass('selectize-input') || e.target.tagName === 'INPUT') {
                    me.app.viewport.popup(me.module.items[me.module.options.searchView]);
                }
            };
        }
        el = me.$$('.selectize-control.multi .selectize-input');
        if (el.length) {
            $(el).on('click', this.selectizeListener);
        }
    },

    beforeClose: function() {
        if (this.selectizeListener) {
            $(this.$$('.selectize-control.multi .selectize-input')).off('click', this.selectizeListener);
            delete this.selectizeListener;
        }
    }
};

setOptions = function(options) {
    var opt = D.assign({}, options, {
        store: {
            models: {
                state: { data: {} },
                Grants: { url: '../system/grant/find-organization-operatortype' },
                search: {
                    data: {},
                    mixin: { getQueryParams: function() {
                        var result = {};
                        _.map(this.data, function(v, k) {
                            result[k] = v.id;
                        });
                        return result;
                    } }
                }
            },

            callbacks: {
                init: function() {
                    var obj = {
                        title: this.module.options.title,
                        search: !!this.module.options.searchView
                    };
                    this.models.state.set(obj, true);

                    this.models.Grants.params = { uri: this.app.global.uri };
                    this.get(this.models.Grants);
                },
                searchChanged: function(payload) {
                    var model = this.models.search.data;
                    _.map(payload, function(item) {
                        model[item.type] = item;
                        if (!item.id) delete model[item.type];
                    });
                    this.models.search.changed();
                },
                removeSearchOption: function(remain) {
                    var data = {};
                    _.map(this.models.search.data, function(item, key) {
                        if (remain.indexOf(key + item.id) !== -1) {
                            data[key] = item;
                        }
                    });
                    this.models.search.set(data, true);
                }
            }
        },
        items: {
            title: 'title',
            toolbox: 'toolbox',
            'human/organization/navigate-tree': { isModule: true, region: 'left' }
        },

        components: [{
            id: 'tree-scrollbar-container',
            name: 'perfect-scrollbar'
        }],

        events: {
            'click toggleTree': 'toggleTree'
        },

        handlers: {
            toggleTree: function() {
                $(this.$('contentLeft')).toggleClass('tree-opend phone-tree-opend');
            }
        },

        afterRender: function() {
            // eslint-disable-next-line no-underscore-dangle
            return this.chain(this._option('afterRenderIt'), function() { this.dispatch('init'); });
        },

        views: {
            title: viewTitle,
            toolbox: viewToolbox
        },

        mixin: {
            nodeChanged: function(node) {
                this.setSearchOptions([{ type: 'organizationId', id: node.id, text: node.text }]);
            },
            setSearchOptions: function(opts) {
                this.dispatch('searchChanged', opts);
            }
        }
    });

    if (options && options.store) {
        D.assign(opt.store.models, options.store.models);
        D.assign(opt.store.callbacks, options.store.callbacks);
    }

    if (options && options.items) {
        D.assign(opt.items, options.items);
    }
    return opt;
};

TreeGridModule = function(name, app, mod, loader, options) {
    var opt = setOptions(options);
    opt.templateEngine = new E({
        path: 'ext/modules/tree-grid/tree-grid-templates',
        views: ['title', 'toolbox'],
        module: this
    });

    // eslint-disable-next-line no-underscore-dangle
    TreeGridModule.__super__.constructor.call(this, name, app, mod, loader, opt);

    // eslint-disable-next-line no-underscore-dangle
    this._loader = new L(this.app, {
        path: 'ext/modules/tree-grid',
        views: ['title', 'toolbox'],
        module: this
    });
};

D.extend(TreeGridModule, D.Module);

D.registerModule('tree-grid', TreeGridModule);
