var D = require('drizzlejs'),
    RECOMMEND_SIZE = 6,
    RESEARCH_TYPE = 1,
    _ = require('lodash/collection');

exports.items = {
    banner: 'banner',
    filter: 'filter',
    list: 'list',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        search: {},
        activitys: {
            url: '../exam/activity/recommends-activity-list'
        },
        gensees: {
            url: '../course-study/gensee/details',
            type: 'pageable',
            root: 'items',
            pageSize: 50
        },
        exams: {
            url: '../exam/exam/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 60
        },
        researchActivitys: {
            url: '../exam/research-activity/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 60
        },
        down: { url: '../human/file/download' }
    },
    callbacks: {
        init: function() {
            var activitys = this.models.activitys,
                exams = this.models.exams,
                gensees = this.models.gensees,
                researchActivitys = this.models.researchActivitys,
                search = this.models.search;

            D.assign(activitys.params, { size: RECOMMEND_SIZE });
            D.assign(researchActivitys.params, { type: RESEARCH_TYPE });
            D.assign(search.data, { searchStatus: 0 });
            this.get(gensees);
            return this.chain([
                this.get(exams),
                this.get(activitys),
                this.get(researchActivitys)
            ]);
        },
        search: function(payload) {
            var gensees = this.models.gensees,
                exams = this.models.exams,
                researchActivitys = this.models.researchActivitys,
                search = this.models.search;

            D.assign(gensees.params, payload);
            D.assign(exams.params, payload);
            D.assign(researchActivitys.params, payload);
            D.assign(search.data, payload);
            search.changed();

            return this.chain([
                this.get(gensees),
                this.get(exams),
                this.get(researchActivitys)
            ]);
        },
        getResearchById: function(payload) {
            return _.find(this.models.researchActivitys.data, function(r) {
                return r.id === payload.id;
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
