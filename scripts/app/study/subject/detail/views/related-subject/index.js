var _ = require('lodash/collection');
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
            url: '../course-study/course-info/related',
            type: 'pageable',
            pageSize: 4,
            root: 'items'
        }
    },
    callbacks: {
        init: function(options) {
            var businessTopics = options.subject.businessTopics;
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            if (businessTopics && businessTopics.length > 0) {
                this.models.courseRelated.params = {
                    topicIds: _.map(businessTopics, 'topicId').join(','),
                    businessType: 2
                };
                this.get(this.models.courseRelated);
            }
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
