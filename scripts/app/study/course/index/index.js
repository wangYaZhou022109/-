var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    catalog: 'catalog',
    list: 'list'
};
exports.store = {
    models: {
        down: { url: '../human/file/download' },
        categories: {
            url: '../course-study/course-category/front',
            mixin: {
                filterPid: function(pid) {
                    return _.filter(this.data, function(item) { return item.parentId === pid; });
                }
            }
        },
        courses: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 9,
            root: 'items',
        },
        state: { data: {} },
        search: { }
    },
    callbacks: {
        init: function(options) {
            var categories = this.models.categories,
                courses = this.models.courses,
                search = this.models.search;
            search.set({ type: 0, companyType: options.companyType });
            categories.params.companyType = options.companyType;
            courses.params = search.data;
            return this.chain([this.get(courses), this.get(categories)]);
        },
        selectMenu2: function(payload) {
            var categories3 = this.models.categories.filterPid(payload.id);
            this.models.state.data.categories3 = categories3;
            return this.models.state.changed();
        },
        selectMenu3: function(payload) {
            var categories4 = this.models.categories.filterPid(payload.id);
            this.models.state.data.categories4 = categories4;
            return this.models.state.changed();
        },
        search: function(payload) {
            var courses = this.models.courses,
                search = this.models.search;
            D.assign(search.data, payload);
            courses.params = search.data;
            return this.get(courses);
        }
    }
};
exports.beforeRender = function() {
    // 默认是本公司
    var options = { companyType: 1 };
    this.dispatch('init', options);
};
