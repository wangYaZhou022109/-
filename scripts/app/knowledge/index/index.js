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
            url: '../course-study/knowledge-category/front',
            autoLoad: 'after',
            mixin: {
                get: function(id) {
                    return _.find(this.data, { id: id });
                },
                filterPid: function(pid) {
                    return _.filter(this.data, function(item) { return item.parentId === pid; });
                }
            }
        },   // 目录
        menu2: { data: [] },
        topics: { data: [], url: '../system/topic/select', autoLoad: 'after' },
        members: {},    // 知识达人
        search: {}, // 搜索
    },
    callbacks: {
        init: function() {
            var search = this.models.search;
            search.set({ orderType: 0 }, true);
        },
        search: function(payload) {
            var search = this.models.search;
            D.assign(search.data, payload);
            return search.changed();
        },
        selectMenu1: function(payload) {
            var menu2 = this.models.menu2;
            var categories2 = this.models.categories.filterPid(payload.id);
            return menu2.set(categories2, true);
        },
        searchKnowledges: function(payload) {
            var knowledges = this.models.knowledges;
            knowledges.params = payload.params;
            return this.get(knowledges);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init');
};

