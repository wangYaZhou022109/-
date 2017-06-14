var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {},
        markPapers: {
            url: '../exam/to-do/mark-papers/page',
            type: 'pageable',
            root: 'items'
        },
        waitMarkPapers: {
            mixin: {
                pushMore: function(exams) {
                    var me = this;
                    _.forEach(exams, function(e) {
                        me.data.push(e);
                    });
                },
            }
        }
    },
    callbacks: {
        init: function() {
            var waitMarkPapers = this.models.waitMarkPapers,
                markPapers = this.models.markPapers;
            return this.get(this.models.markPapers).then(function() {
                waitMarkPapers.set(markPapers.data);
                waitMarkPapers.changed();
            });
        },
        waitTodo: function(payload) {
            var waitMarkPapers = this.models.waitMarkPapers,
                markPapers = this.models.markPapers;
            markPapers.clear();
            D.assign(markPapers.params, payload);
            D.assign(this.models.state.data, {
                wait: payload.wait,
                checked: payload.wait === 1
            });
            this.models.state.changed();
            return this.get(markPapers).then(function() {
                waitMarkPapers.set(markPapers.data);
                waitMarkPapers.changed();
            });
        },
        loadMore: function() {
            var markPapers = this.models.markPapers,
                waitMarkPapers = this.models.waitMarkPapers;
            markPapers.turnToPage(markPapers.params.page + 1);
            return this.get(markPapers).then(function() {
                waitMarkPapers.pushMore(markPapers.data);
                waitMarkPapers.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
