var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main',
    filter: 'filter',
    tips: ''
};

exports.store = {
    models: {
        exams: {
            url: '../exam/exam/person-center-list',
            type: 'pageable',
            root: 'items'
        },
        search: {
            data: {
                searchStatus: null,
                type: null,
                startTimeOrderBy: 0
            }
        },
        signUp: { url: '../exam/sign-up' },
        validateExam: { url: '../exam/exam/validate-exam' },
        examRecord: { url: '../exam/exam/user-record' }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.exams);
        },
        selectItem: function(payload) {
            this.models.exams.clear();
            D.assign(this.models.search.data, payload);
            this.models.search.changed();
            D.assign(this.models.exams.params, this.models.search.data);
            return this.get(this.models.exams);
        },
        cancel: function(payload) {
            var me = this;
            this.models.signUp.set({ id: payload.examId });
            return this.del(this.models.signUp).then(function() {
                return me.get(me.models.exams);
            });
        },
        signUp: function(payload) {
            var me = this;
            this.models.signUp.set(payload);
            return this.post(this.models.signUp).then(function() {
                return me.get(me.models.exams);
            });
        },
        validateExam: function(payload) {
            D.assign(this.models.validateExam.params, payload);
            return this.get(this.models.validateExam);
        },
        getExamRecordByExamId: function(payload) {
            var exam = _.find(this.models.exams.data, function(e) {
                    return e.examRecord.id === payload.examRecordId;
                }),
                me = this;
            this.models.examRecord.set({ id: exam.id });
            return this.get(this.models.examRecord).then(function() {
                return me.models.examRecord.data.examRecord || {};
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
