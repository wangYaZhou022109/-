var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        exams: {
            url: '../exam/exam/details',
            type: 'pageable',
            root: 'items'
        },
        search: { data: { startTimeOrderBy: 0 } },
        signUp: { url: '../exam/sign-up' }
    },
    callbacks: {
        init: function() {
            var searchModel = this.models.search,
                exams = this.models.exams;
            D.assign(exams.params, searchModel.data);
            return this.get(exams);
        },
        search: function(params) {
            var searchModel = this.models.search,
                exams = this.models.exams;
            D.assign(exams.params, D.assign(searchModel.data, params));
            this.get(exams);
            searchModel.changed();
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
        refreshList: function() {
            var exams = this.models.exams;
            D.assign(exams.params, this.models.search.data);
            return this.get(exams);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
