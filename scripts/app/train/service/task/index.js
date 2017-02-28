exports.items = {
    main: 'main',
    edit: ''
};

exports.store = {
    models: {
        tasks: {
            url: '../train/task/page',
            type: 'pageable',
            root: 'items'
        }
    },
    callbacks: {
        init: function(payload) {
            var tasks = this.models.tasks;
            tasks.params = payload;
            return this.get(tasks);
        },
        search: function(payload) {
            var tasks = this.models.tasks;
            tasks.params = payload;
            return this.get(tasks);
        }
    }
};

exports.beforeRender = function() {
};
