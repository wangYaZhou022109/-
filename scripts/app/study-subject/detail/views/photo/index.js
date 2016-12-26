exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        download: {
            url: '../human/file/download'
        },
        coursePhoto: {
            url: '../course-study/course-front/course-photo',
            type: 'pageable',
            pageSize: 6,
            root: 'items'
        }
    },
    callbacks: {
        init: function(options) {
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            this.models.coursePhoto.params.id = options.subject.id;
            return this.get(this.models.coursePhoto);
        },
        turnPage: function(data) {
            this.models.coursePhoto[data + 'Page']();
            this.get(this.models.coursePhoto);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
