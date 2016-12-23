var D = require('drizzlejs');
exports.items = {
    banner: 'banner',
    filter: 'filter',
    list: 'list'
};

exports.store = {
    models: {
        activitys: {
            url: '../exam/activity',
            type: 'pageable',
            root: 'items'
        },
        activity: { url: '../exam/activity' },
        params: { data: { isOverdue: false } }
    },
    callbacks: {
        init: function() {
            this.models.activitys.params = this.models.params.data;
            this.get(this.models.activitys);
        },
        search: function(payload) {
            var data = this.models.params.data;
            D.assign(data, payload);
            this.models.params.changed();
            this.models.activitys.params = data;
            this.get(this.models.activitys);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
