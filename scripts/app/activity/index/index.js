var D = require('drizzlejs'),
    // RECOMMEND_SIZE = 6,
    RESEARCH_TYPE = 1,
    _ = require('lodash/collection');

exports.items = {
    banner: 'banner',
    filter: 'filter',
    gensee: 'gensee',
    exam: 'exam',
    research: 'research',
    'activity/index/exam-prompt': { isModule: true },
    'class-info': 'class-info'
};

exports.store = {
    models: {
        search: {
            data: {
                searchStatus: 0
            }
        },
        activitys: {
            url: '../exam/activity/recommends-activity-list'
        },
        gensees: {
            url: '../course-study/gensee/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 50
        },
        exams: {
            url: '../exam/exam/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 90
        },
        researchActivitys: {
            url: '../exam/research-activity/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 24
        },
        down: { url: '../human/file/download' },
        classSignupInfo: {
            url: '../train/sign-up/find-by-code'
        },
        classDetailes: {
            url: '../train/class-info/find-activity-classinfo',
            type: 'pageable',
            root: 'items',
            pageSize: 90
        },
        classSignupByclassId: { url: '../train/sign-up' }
    },
    callbacks: {
        init: function() {
            var activitys = this.models.activitys,
                exams = this.models.exams,
                gensees = this.models.gensees,
                researchActivitys = this.models.researchActivitys,
                search = this.models.search,
                classDetailes = this.models.classDetailes;
            // D.assign(activitys.params, { size: RECOMMEND_SIZE }); // 暂时不限制最大条数，将所有推荐的数据查询出来
            D.assign(researchActivitys.params, { type: RESEARCH_TYPE });
            D.assign(search.data, { searchStatus: 0 });
            return this.chain([
                this.get(activitys),
                this.get(gensees),
                this.get(exams),
                this.get(researchActivitys),
                this.get(classDetailes)
            ]);
        },
        search: function(payload) {
            var gensees = this.models.gensees,
                exams = this.models.exams,
                researchActivitys = this.models.researchActivitys,
                search = this.models.search,
                classDetailes = this.models.classDetailes;

            D.assign(gensees.params, payload);
            D.assign(exams.params, payload);
            D.assign(researchActivitys.params, payload);
            D.assign(classDetailes.params, payload);
            D.assign(search.data, payload);
            search.changed();

            return this.chain([
                this.get(gensees),
                this.get(exams),
                this.get(researchActivitys),
                this.get(classDetailes)
            ]);
        },
        getResearchById: function(payload) {
            return _.find(this.models.researchActivitys.data, function(r) {
                return r.id === payload.id;
            });
        },
        getClassSignupInfo: function(payload) {
            var classSignupInfo = this.models.classSignupInfo;
            classSignupInfo.clear();
            classSignupInfo.params = payload;
            return this.get(classSignupInfo);
        },
        getClassSignupByclassId: function(payload) {
            var classSignupByclassId = this.models.classSignupByclassId;
            classSignupByclassId.clear();
            classSignupByclassId.params = { classId: payload.id };
            return this.get(classSignupByclassId);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
