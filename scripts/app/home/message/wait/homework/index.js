var D = require('drizzlejs');
exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {},
        works: {
            url: '../course-study/course-front/audit-works',
            params: { page: 1, pageSize: 10 }
        }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.works);
        },
        refreshList: function(payload) {
            D.assign(this.models.works.params, payload);
            return this.get(this.models.works);
        },
        showMore: function() {
            var pageSize = this.models.works.params.pageSize;
            this.models.works.params.pageSize = Number(pageSize) + 10;
            return this.get(this.models.works);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
