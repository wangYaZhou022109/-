var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    top: 'top',
    catalog: 'catalog',
    catalogs: 'catalogs',
    list: 'list'
};
exports.store = {
    models: {
        down: { url: '../human/file/download' },
        categories: {
            url: '../course-study/course-category',
            mixin: {
                filterPid: function(pid) {
                    return _.filter(this.data, function(item) { return item.parentId === pid; });
                }
            }
        },
        courses: {
            url: '../course-study/course-front',
            type: 'pageable',
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
            search.set({ type: 0 });
            categories.params = options;
            courses.params = search.data;
            return this.chain([this.get(categories), this.get(courses)]);
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
    var options = { organizationId: '1' };
    this.dispatch('init', options);
};
