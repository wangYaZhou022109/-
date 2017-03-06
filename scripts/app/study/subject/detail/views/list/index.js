exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        lists: {
            url: '../course-study/course-study-progress/list'
        },
        download: {
            url: '../human/file/download'
        }
    },
    callbacks: {
        init: function(options) {
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            if (options.subject.id) {
                this.models.lists.params = {
                    businessId: options.subject.id,
                    limitCount: 10
                };
                return this.get(this.models.lists);
            }
            return this.models.lists;
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
