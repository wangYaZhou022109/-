exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subjectNews: { url: '../course-study/course-front/subject-news' },
        homeNews: {}
    },
    callbacks: {
        init: function(options) {
            var id = options.id,
                type = options.type,
                newsModel = type === '0' ? this.models.homeNews : this.models.subjectNews;
            newsModel.params.id = id;
            return this.get(newsModel);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
