exports.items = {
    top: 'top',
    catalog: 'catalog',
    list: 'list'
};
exports.store = {
    models: {
        categories: { url: '../course-study/course-category' },
        courses: {
            url: '../course-study/course-info',
            type: 'pageable',
            root: 'items'
        },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var categories = this.models.categories,
                courses = this.models.courses;
            categories.params = options;
            return this.chain([this.get(categories), this.get(courses)]);
        }
    }
};
exports.beforeRender = function() {
    var options = { organizationId: '1' };
    this.dispatch('init', options);
};
