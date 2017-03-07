var D = require('drizzlejs');
exports.items = {
    banner: 'banner',
    filter: 'filter',
    list: 'list',
    'exam/index': { isModule: true }
};

exports.store = {
    models: {
        activitys: {
            url: '../exam/activity',
            type: 'pageable',
            root: 'items',
            pageSize: 6
        },
        gensees: { url: '../course-study/gensee-student/list' },
        activity: { url: '../exam/activity' },
        params: { data: { isOverdue: false } },
        down: { url: '../human/file/download' }
    },
    callbacks: {
        init: function() {
            this.models.activitys.params = this.models.params.data;
            this.get(this.models.activitys);
            // this.get(this.models.gensees);
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
