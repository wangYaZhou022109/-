var D = require('drizzlejs');

exports.items = {
    main: 'main',
    search: 'search'
};

exports.store = {
    models: {
        tasks: {
            url: '../human/task',
            type: 'pageable',
            root: 'items'
        },
        search: {}
    },
    callbacks: {
        init: function(payload) {
            D.assign(this.models.tasks.params, payload);
            return this.get(this.models.tasks);
        },
        search: function(payload) {
            this.models.tasks.clear();
            D.assign(this.models.search.data, payload);
            D.assign(this.models.tasks.params, this.models.search.data);
            this.models.search.changed();
            return this.get(this.models.tasks);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
