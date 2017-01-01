module.exports = {
    items: { 'study-subject': 'study-subject' },
    beforeRender: function() {
        this.dispatch('init', this.renderOptions);
    },
    store: {
        models: {
            homeConfig: {},
            course: { url: '../course-study/course-info/ids' },
            down: { url: '../human/file/download' }
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
