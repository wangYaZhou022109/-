var D = require('drizzlejs');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        subjects: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 9,
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
        }
    },
    callbacks: {
        init: function() {
            var subjects = this.models.subjects;
            subjects.params.type = 1; // 资源类型为专题
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
        searchByName: function(payload) {
            this.models.subjects.params.searchContent = payload.name;
            return this.get(this.models.subjects);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
