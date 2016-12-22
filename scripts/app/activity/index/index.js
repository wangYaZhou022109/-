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
        activity: { url: '../exam/activity' }
    },
    callbacks: {
        init: function(payload) {
            this.get(this.models.activitys);
        },
        search: function(payload) {
            var data = payload;
            this.models.activitys.params = data;
            this.get(this.models.activitys);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
