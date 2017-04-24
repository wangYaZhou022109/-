var D = require('drizzlejs');
exports.items = {
    main: 'main',
    filter: 'filter'
};

exports.store = {
    models: {
        exams: {
            url: '../exam/exam/person-center-list',
            type: 'pageable',
            root: 'items'
        },
        search: {
            data: {
                searchStatus: null,
                type: null
            }
        },
        signUp: { url: '../exam/sign-up' }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.exams);
        },
        selectItem: function(payload) {
            D.assign(this.models.search.data, payload);
            this.models.search.changed();
            D.assign(this.models.exams.params, this.models.search.data);
            return this.get(this.models.exams);
        },
        cancel: function(payload) {
            var me = this;
            this.models.signUp.set({ id: payload.examId });
            return this.del(this.models.signUp).then(function() {
                return me.get(me.models.exams);
            });
        },
        signUp: function(payload) {
            var me = this;
            this.models.signUp.set(payload);
            return this.post(this.models.signUp).then(function() {
                return me.get(me.models.exams);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
