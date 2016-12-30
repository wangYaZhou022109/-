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
        courseRelated: {
            url: '../course-study/course-front/related',
            type: 'pageable',
            pageSize: 2,
            root: 'items'
        }
    },
    callbacks: {
        init: function(options) {
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            if (options.subject.id) {
                this.models.courseRelated.params.id = options.subject.id;
                return this.get(this.models.courseRelated);
            }
            return this.models.courseRelated;
        },
        turnPage: function() {
            var pageInfo = this.models.courseRelated.getPageInfo();
            if (pageInfo.page === pageInfo.pageCount) {
                this.models.courseRelated.turnToPage(1);
            } else {
                this.models.courseRelated.nextPage();
            }
            return this.get(this.models.courseRelated);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
