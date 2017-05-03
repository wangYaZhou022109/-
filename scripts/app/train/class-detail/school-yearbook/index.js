var D = require('drizzlejs');
exports.title = '同学录';
exports.items = {
    menu: 'menu',
    list: 'list'
};
exports.store = {
    models: {
        list: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        menu: {
            url: '../train/trainee-group'
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var menu = this.models.menu,
                state = this.models.state.data;
            state.classId = payload;
            menu.params = { classId: payload };
            return this.get(menu);
        },
        list: function(params) {
            var list = this.models.list;
            D.assign(list.params, {
                classId: this.models.state.data.classId,
                auditStatus: 1,
                groupId: params
            });
            return this.get(list);
        },
    }
};
exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions.classId).then(function(data) {
        var proupId = 0;
        if (data[0] != null || []) {
            proupId = data[0][0].id;
        }
        me.dispatch('list', proupId);
    });
};
