var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        progressList: {
            url: '../course-study/course-study-progress/person-list',
            type: 'pageable',
            root: 'items'
        },
        progress: { url: '../course-study/course-study-progress/give-up' },
        search: { data: { businessType: 0, findStudy: 0 } },
        img: { url: '../human/file/download' },
        register: { url: '../course-study/course-front/register' }
    },
    callbacks: {
        init: function() {
            var searchModel = this.models.search,
                progressList = this.models.progressList;
            progressList.clear();
            searchModel.data.businessType = 2;
            searchModel.data.studyTimeOrder = 'desc';
            D.assign(progressList.params, searchModel.data);
            return this.get(progressList);
        },
        register: function(payload) {
            var register = this.models.register,
                me = this;
            register.set({ courseId: payload.id });
            return me.post(register);
        },
        search: function(params) {
            var searchModel = this.models.search,
                progressList = this.models.progressList;
            D.assign(progressList.params, D.assign(searchModel.data, params));
            this.get(progressList);
            searchModel.changed();
        },
        enterSearch: function(params) {
            var searchModel = this.models.search,
                progressList = this.models.progressList;
            D.assign(progressList.params, D.assign(searchModel.data, params));
            this.get(progressList);
            searchModel.changed();
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
