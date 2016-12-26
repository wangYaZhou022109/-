module.exports = {
    items: { 'online-course': 'online-course' },
    beforeRender: function() {
        if (this.renderOptions.id) {
            this.dispatch('init', this.renderOptions);
        }
    },
    store: {
        models: {
            homeConfig: {},
            course: { url: '../course-study/course-info/ids' }
        },
        callbacks: {
            init: function(mod) {
                var ids = [];
                this.models.homeConfig.data = mod;
                mod.items.forEach(function(item) {
                    ids.push(item.sourceId);
                });
                this.models.course.params = {
                    ids: ids.join(',')
                };
                return ids.length && this.get(this.models.course);
            }
        }
    }
};
