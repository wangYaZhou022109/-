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
        gensees: { url: '../course-study/gensee-student/list' },
        activity: { url: '../exam/activity' },
        params: { data: { all: true } },
        down: { url: '../human/file/download' },
        exams: {
            url: '../exam/exam',
            type: 'pageable',
            root: 'items',
            pageSize: 6
        },
        researchActivitys: {
            url: '../exam/research-activity',
            type: 'pageable',
            root: 'items',
            pageSize: 6
        }
    },
    callbacks: {
        init: function() {
            this.models.activitys.params.size = RECOMMEND_SIZE;
            this.get(this.models.activitys);
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
            this.get(this.models.exams);
            this.models.researchActivitys.params = this.models.params.data;
            this.get(this.models.researchActivitys);
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
            var exams = this.models.exams.data;
            return _.find(exams, ['id', payload.id]);
        },
        getResearchById: function(payload) {
            var researchs = this.models.researchActivitys.data;
            return _.find(researchs, ['id', payload.id]);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
