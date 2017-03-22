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
            autoLoad: 'after',
            mixin: {
                get: function(id) {
                    return _.find(this.data, { id: id });
                },
                filterPid: function(pid) {
                    return _.filter(this.data, function(item) { return item.parentId === pid; });
                }
            }
        },
        courses: {
            url: '../course-study/course-front',
            type: 'pageable',
            pageSize: 20,
            root: 'items',
        },
        topics: { data: [], url: '../system/topic/select', autoLoad: 'after' },
        state: {},
        menu2: { data: [] },
        search: {}
    },
    callbacks: {
        init: function() {
            var search = this.models.search;
            search.set({ type: 0, companyType: 0 }, true);
        },
        selectMenu1: function(payload) {
            var menu2 = this.models.menu2;
            var categories2 = this.models.categories.filterPid(payload.id);
            return menu2.set(categories2, true);
        },
        clearMenu1: function() {
            this.models.state.data.categories2 = [];
            return this.models.state.changed();
        },
        search: function(payload) {
            var search = this.models.search;
            D.assign(search.data, payload);
            return search.changed();
        },
        searchCourse: function(payload) {
            var courses = this.models.courses;
            courses.params = payload.params;
            return this.get(courses);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init');
};
