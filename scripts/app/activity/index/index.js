var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    RECOMMEND_SIZE = 6,
    RESEARCH_TYPE = 1;

exports.items = {
    banner: 'banner',
    filter: 'filter',
    list: 'list',
    'exam/index': { isModule: true },
    'exam-tips': '',
    'research-tips': ''
};

exports.store = {
    models: {
        activitys: {
            url: '../exam/activity/recommends',
            data: []
        },
        gensees: { url: '../course-study/gensee/details',
            type: 'pageable',
            root: 'items',
            pageSize: 25 },
        activity: { url: '../exam/activity' },
        params: { data: { all: true } },
        down: { url: '../human/file/download' },
        exams: {
            url: '../exam/exam/details',
            type: 'pageable',
            root: 'items',
            pageSize: 18
        },
        exam: { url: '../exam/exam/exam-sign-up' },
        examOfUser: { url: '../exam/exam/exam-of-user/' },
        currentExam: { },
        signUp: { url: '../exam/sign-up' },
        researchActivitys: {
            url: '../exam/research-activity/activity-list',
            type: 'pageable',
            root: 'items',
            pageSize: 18
        },
        researchRecord: {
            url: '../exam/research-record/get-by-research'
        }
    },
    callbacks: {
        init: function() {
            this.models.activitys.params.size = RECOMMEND_SIZE;
            this.get(this.models.activitys);
            this.models.gensees.params = this.models.params.data;
            this.get(this.models.gensees);
            this.models.exams.params = this.models.params.data;
            this.get(this.models.exams);
            this.models.researchActivitys.params = this.models.params.data;
            this.models.researchActivitys.params.type = RESEARCH_TYPE;
            this.get(this.models.researchActivitys);
        },
        search: function(payload) {
            D.assign(this.models.params.data, payload);
            this.models.params.changed();
            this.models.exams.params = this.models.params.data;
            this.models.researchActivitys.params = this.models.params.data;
            this.models.gensees.params = this.models.params.data;
            return this.chain([this.get(this.models.exams),
                this.get(this.models.researchActivitys),
                this.get(this.models.gensees)]);
        },
        examLeft: function() {
            var page = this.models.exams.params.page;
            if (page && page > 1) {
                this.models.exams.turnToPage(page - 1);
                this.get(this.models.exams);
            }
        },
        examRight: function() {
            var page = this.models.exams.params.page;
            if (page) {
                this.models.exams.turnToPage(page + 1);
                this.get(this.models.exams);
            }
        },
        researchLeft: function() {
            var page = this.models.researchActivitys.params.page;
            if (page && page > 1) {
                this.models.researchActivitys.turnToPage(page - 1);
                this.get(this.models.researchActivitys);
            }
        },
        researchRight: function() {
            var page = this.models.researchActivitys.params.page;
            if (page) {
                this.models.researchActivitys.turnToPage(page + 1);
                this.get(this.models.researchActivitys);
            }
        },
        getExamById: function(payload) {
            this.models.examOfUser.set({ id: payload.id });
            return this.get(this.models.examOfUser);
        },
        signUp: function(examId) {
            this.models.signUp.set({ examId: examId });
            return this.post(this.models.signUp);
        },
        revoke: function(examId) {
            var me = this;
            this.models.signUp.set({ id: examId });
            return me.del(me.models.signUp);
        },
        refreshCurrentExam: function(examId) {
            var me = this,
                exams = me.models.exams.data;
            me.models.currentExam.data = _.find(exams, ['id', examId]);
            me.models.exam.set({ id: examId });
            me.get(me.models.exam).then(function(data) {
                me.models.currentExam.data.signUp = data[0].signUp;
                me.models.currentExam.changed();
            });
        },
        getResearchRecord: function(payload) {
            this.models.researchRecord.clear();
            D.assign(this.models.researchRecord.params, payload);
            return this.get(this.models.researchRecord);
        },
        clearResearchRecord: function() {
            this.models.researchRecord.clear();
        },
        getResearchById: function(payload) {
            return this.models.researchActivitys.data.find(function(r) {
                return r.id === payload.id;
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
