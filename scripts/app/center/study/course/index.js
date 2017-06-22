var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        progressList: {
            url: '../course-study/course-study-progress/person-list',
            type: 'pageable',
            root: 'items',
            mixin: {
                findByCourseId: function(id) {
                    return _.find(this.data, {
                        courseId: id
                    });
                }
            }
        },
        progress: { url: '../course-study/course-study-progress/give-up' },
        search: { data: { businessType: 0, findStudy: 0, studyTimeOrder: 'desc' } },
        img: { url: '../human/file/download' }
    },
    callbacks: {
        init: function() {
            var searchModel = this.models.search,
                progressList = this.models.progressList;
            progressList.clear();
            D.assign(progressList.params, searchModel.data);
            return this.get(progressList);
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
        },
        deleteProgress: function(params) {
            var progressModel = this.models.progress;
            progressModel.set(params);
            return this.save(progressModel);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};
