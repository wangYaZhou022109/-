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
        },
        register: { url: '../course-study/course-front/register' }
    },
    callbacks: {
        init: function(options) {
            var businessTopics = options.subject.businessTopics;
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            if (businessTopics && businessTopics.length > 0) {
                this.models.courseRelated.params = {
                    topicIds: _.map(businessTopics, 'topicId').join(','),
                    businessType: 2,
                    courseId: options.subject.id
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
        },
        register: function(payload) {
            var register = this.models.register,
                me = this;
            register.set({
                courseId: payload.id
            });
            return me.post(register);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
