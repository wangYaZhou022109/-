var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    catalog: 'catalog',
    sorts: 'sorts',
    main: 'main',
    side: 'side',
    'knowledge/index/modal': { isModule: true }
};

exports.store = {
    models: {
        download: { url: '../human/file/download' },
        knowledges: {
            url: '../course-study/knowledge/front',
            type: 'pageable',
            pageSize: 20,
            root: 'items',
        }, // 知识
        totalFront: {
            url: '../course-study/knowledge/totalFront',
            autoLoad: 'after',
        },
        talents: { // 上传达人
            url: '../course-study/knowledge/talent',
            autoLoad: 'after',
        },
        categories: {
            url: '../course-study/knowledge-category/chooser',
            mixin: {
                get: function(id) {
                    return _.find(this.data, { id: id });
                },
                filterPid: function(pid) {
                    return _.filter(this.data, function(item) { return item.parentId === pid; });
                },
                findLevel: function(n) {
                    var level = n || 1;
                    return _.filter(this.data, function(item) {
                        return (item.path.split(',').length - 1) === level;
                    });
                }
            }
        },   // 目录
        menu2: { data: [] },
        topicIds: { url: '../course-study/knowledge/topics', autoLoad: 'after' },
        topics: { url: '../system/topic/ids' },
        search: {} // 搜索
    },
    callbacks: {
        init: function() {
            var search = this.models.search,
                categories = this.models.categories,
                companyOrganization = this.app.global.currentUser.companyOrganization || {};
            search.set({ orderType: '0' }, true);
            this.models.menu2.set(this.models.categories.findLevel(3));
            categories.params = {
                companyId: companyOrganization.id,
                rootOrganizationId: this.app.global.currentUser.rootOrganization.id
            };
            return this.get(categories);
        },
        search: function(payload) {
            var search = this.models.search;
            D.assign(search.data, payload);
            return search.changed();
        },
        selectMenu1: function(payload) {
            var menu2 = this.models.menu2,
                categories2;
            if (payload.id) categories2 = this.models.categories.filterPid(payload.id);
            else categories2 = this.models.categories.findLevel(3);
            return menu2.set(categories2, true);
        },
        searchKnowledges: function(payload) {
            var knowledges = this.models.knowledges;
            knowledges.params = payload.params;
            return this.get(knowledges);
        },
        searchTopics: function(payload) {
            var model = this.models.topics;
            model.params = payload;
            return this.get(model);
        }
    }
};
exports.afterRender = function() {
    return this.dispatch('init');
};
