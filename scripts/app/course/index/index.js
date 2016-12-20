var _ = require('lodash/collection');
exports.items = {
    top: 'top',
    catalog: 'catalog',
    list: 'list'
};
exports.store = {
    models: {
        categories: {
            url: '../course-study/course-category',
            mixin: {
                filterPid: function(pid) {
                    return _.filter(this.data, function(item) {
                        return item.parentId === pid;
                    });
                }
            }
        },
        courses: {
            url: '../course-study/course-info',
            type: 'pageable',
            root: 'items'
        },
        state: { data: {} }
    },
    callbacks: {
        init: function(options) {
            var categories = this.models.categories,
                courses = this.models.courses;
            categories.params = options;
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
        }
    }
};
exports.beforeRender = function() {
    var options = { organizationId: '1' };
    this.dispatch('init', options);
};
