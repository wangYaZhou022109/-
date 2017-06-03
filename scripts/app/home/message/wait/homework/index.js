var D = require('drizzlejs');
exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {},
        works: {
            url: '../course-study/course-front/audit-works',
            type: 'pageable',
            pageSize: 20,
            root: 'items'
        }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.works);
        },
        refreshList: function(payload) {
            D.assign(this.models.works.params, payload);
            return this.get(this.models.works);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
