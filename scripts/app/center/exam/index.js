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
        search: { data: { startTimeOrderBy: 0 } }
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
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
