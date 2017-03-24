var D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {},
        waitMarkPapers: {
            url: '../exam/to-do/mark-papers'
        }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.waitMarkPapers);
        },
        waitTodo: function(payload) {
            D.assign(this.models.state.data, {
                wait: payload.wait,
                checked: payload.wait === 1
            });
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
