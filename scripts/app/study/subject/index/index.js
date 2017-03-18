var D = require('drizzlejs');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        subjects: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 16,
            root: 'items'
        },
        search: {
            data: {
                orderBy: '0',
                order: 2,
                top: 'top'
            }
        },
        download: {
            url: '../human/file/download'
        },
        topics: { data: [], url: '../system/topic/hot?limit=8&type=5', autoLoad: 'after' }
    },
    callbacks: {
        init: function() {
            var subjects = this.models.subjects;
            subjects.params.type = 2; // 资源类型为专题
            return this.get(subjects);
        },
        order: function(payload) {
            var search = this.models.search.data,
                order = 1;
            if (search && search.order === 1) {
                order = 2;
            }
            this.models.subjects.params.order = order;
            this.models.subjects.params.orderBy = payload.orderBy;
            this.models.search.set(D.assign(search, this.models.subjects.params));
            this.models.search.changed();
            return this.get(this.models.subjects);
        },
        search: function(payload) {
            var search = this.models.search;
            D.assign(search.data, payload);
            D.assign(this.models.subjects.params, payload);
            this.models.search.changed();
            return this.get(this.models.subjects);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
