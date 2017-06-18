exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        exams: { url: '../exam/exam/front/person-center-list', type: 'pageable', root: 'items' },
        export: { url: '../exam/exam-record/export-person-list' }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.exams, { loading: true });
        }
    }
};


exports.beforeRender = function() {
    return this.dispatch('init');
};
