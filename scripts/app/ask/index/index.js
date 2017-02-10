var D = require('drizzlejs');
exports.items = {
    filter: 'filter',
    list: 'list',
    menu: 'menu',
    'right-btn': 'right-btn'
};

exports.store = {
    models: {
        state: {},
        askbar: { url: '../exam/activity' },
        content: { url: '../ask/content' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function(payload) {
            var isOverdue = payload.isOverdue,
                data = this.models.params.data,
                state = this.models.state;
            if (isOverdue !== '1' && isOverdue !== '2' && isOverdue !== '3') {
                this.models.askbar.params = this.models.params.data;
            } else {
                data = this.models.params.data;
                D.assign(data, payload);
                this.models.params.changed();
                this.models.askbar.params = data;
            }
            // console.log(this.models.activitys.params);
            // this.get(this.models.content);
            state.data.menu = 'all-dynamic';
            state.data['all-dynamic'] = true;
        },
        search: function(payload) {
            var data = this.models.params.data;
            D.assign(data, payload);
            this.models.params.changed();
            this.models.askbar.params = data;
            // this.get(this.models.activitys);
        }
    }
};

exports.afterRender = function() {
    var me = this,
        renderOptions = this.renderOptions;
    console.log(me.regions);
    this.store.module.dispatch('init', renderOptions).then(function() {
        me.regions.list.show('ask/content/all-dynamic', {
            params: me.store.models.params || {}
        });
    });
   // return this.dispatch('init', this.renderOptions);
};


exports.events = {
    'click mymanage-*': 'mymanage',
    'click myquiz-*': 'myquiz'
};

exports.handlers = {
    mymanage: function() {
        var region;
        var el = this.$('left');
        region = new D.Region(this.app, this.module, el);
        region.show('ask/mymanage');
    },
    myquiz: function() {
        var region;
        var el = this.$('left');
        region = new D.Region(this.app, this.module, el);
        region.show('ask/myquiz');
    }
};
