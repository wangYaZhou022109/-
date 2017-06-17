var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        lives: {
            url: '../course-study/gensee/person-list',
            type: 'pageable',
            root: 'items'
        },
        search: { data: { startTimeOrderBy: 0 } },
        img: { url: '../human/file/download' }
    },
    callbacks: {
        init: function() {
            var searchModel = this.models.search,
                lives = this.models.lives;
            D.assign(lives.params, searchModel.data);
            return this.get(lives);
        },
        search: function(params) {
            var searchModel = this.models.search,
                lives = this.models.lives;
            lives.clear();
            D.assign(lives.params, D.assign(searchModel.data, params));
            this.get(lives);
            searchModel.changed();
        },
        refreshList: function() {
            var lives = this.models.lives;
            D.assign(lives.params, this.models.search.data);
            return this.get(lives);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
