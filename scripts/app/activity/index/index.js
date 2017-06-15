var D = require('drizzlejs'),
    // RECOMMEND_SIZE = 6,
    RESEARCH_TYPE = 1,
    toArray,
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
            pageSize: 5
        },
        exams: {
            url: '../exam/exam/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 18
        },
        examMores: {
            data: {},
            mixin: {
                init: function(exams) {
                    var examArray = toArray(exams, 6);
                    this.data = {
                        list: exams,
                        examArray: examArray,
                        pageCount: examArray.length,
                        page: 0
                    };
                },
                reset: function() {
                    var examArray = toArray(this.data.list, 6);
                    D.assign(this.data, {
                        examArray: examArray,
                        pageCount: examArray.length
                    });
                },
                pushExams: function(exams) {
                    var me = this;
                    _.forEach(exams, function(e) {
                        me.data.list.push(e);
                    });
                    this.reset();
                },
                changePage: function(page) {
                    D.assign(this.data, {
                        page: page
                    });
                }
            }
        },
        researchActivitys: {
            url: '../exam/research-activity/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 6
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
                examMores = this.models.examMores,
                gensees = this.models.gensees,
                researchActivitys = this.models.researchActivitys,
                search = this.models.search,
                classDetailes = this.models.classDetailes;
            // D.assign(activitys.params, { size: RECOMMEND_SIZE }); // 暂时不限制最大条数，将所有推荐的数据查询出来
            D.assign(researchActivitys.params, { type: RESEARCH_TYPE });
            D.assign(search.data, { searchStatus: 0 });
            return this.chain([
                this.get(activitys, { loading: true }),
                this.get(gensees, { loading: true }),
                this.get(exams, { loading: true }),
                this.get(researchActivitys, { loading: true }),
                this.get(classDetailes, { loading: true })
            ]).then(function() {
                examMores.init(exams.data);
                examMores.changed();
            });
        },
        search: function(payload) {
            var gensees = this.models.gensees,
                exams = this.models.exams,
                examMores = this.models.examMores,
                researchActivitys = this.models.researchActivitys,
                search = this.models.search,
                classDetailes = this.models.classDetailes;

            gensees.clear();
            researchActivitys.clear();
            exams.clear();
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
            ]).then(function() {
                examMores.init(exams.data);
                examMores.changed();
            });
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
        pushMoreExams: function(payload) {
            var examMores = this.models.examMores,
                exams = this.models.exams;
            if (payload.page > examMores.data.pageCount - 1) {
                examMores.changePage(payload.page);
                exams.turnToPage(exams.params.page + 1);
                return this.get(exams).then(function() {
                    examMores.pushExams(exams.data);
                    examMores.changed();
                });
            }
            examMores.changePage(payload.page);
            return '';
        },
        changeExamPage: function(payload) {
            var examMores = this.models.examMores;
            examMores.changePage(payload.page);
        },
        turnToModelPage: function(payload) {
            var model = this.models[payload.model],
                pageInfo = model.getPageInfo(),
                currentPage = pageInfo.page;
            model[payload.dir + 'Page']();
            if (currentPage !== model.getPageInfo().page) {
                return this.get(model);
            }
            return true;
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

toArray = function(objs, pageSize) {
    var array = [],
        temp = [],
        obj,
        i;
    if (objs && objs.length) {
        for (i = 1; i <= objs.length; i++) {
            temp.push(objs[i - 1]);
            if (i % pageSize === 0) {
                obj = {};
                obj.a = temp;
                array.push(obj);
                temp = [];
            }
        }
        if (temp.length > 0) {
            obj = {};
            obj.a = temp;
            array.push(obj);
        }
        return array;
    }
    return [];
};
