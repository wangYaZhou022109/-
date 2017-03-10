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
        search: { data: { businessType: 0 } },
        img: { url: '../human/file/download' }
    },
    callbacks: {
        init: function(options) {
            var menu = options.state.menu,
                searchModel = this.models.search,
                progressList = this.models.progressList;
            if (menu === 'study/subject') { // 专题
                searchModel.data.businessType = 2;
                searchModel.data.registerTimeOrder = 'desc';
            }
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
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
