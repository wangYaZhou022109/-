exports.items = {
    pannel: 'pannel',
    more: ''
};

exports.store = {
    models: {
        region: {},
        subject: {},
        lists: {
            url: '../course-study/course-study-progress/list'
        },
        pageList: {
            url: '../course-study/course-study-progress/page-list',
            type: 'pageable',
            pageSize: 10,
            root: 'items'
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
        },
        more: function() {
            var subject = this.models.subject.data,
                pageList = this.models.pageList;
            pageList.params.businessId = subject.id;
            return this.get(pageList);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
