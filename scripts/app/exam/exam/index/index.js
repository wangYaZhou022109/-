var D = require('drizzlejs'),
    errors = require('./app/util/errors');

exports.items = {
    main: 'main',
    tips: '',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        state: {},
        audience: { url: '../exam/exam/is-audient' }
    },
    callbacks: {
        init: function(payload) {
            var audience = this.models.audience,
                state = this.models.state;

            if (payload.examId) {
                state.set({ examId: payload.examId });
                D.assign(audience.params, { examId: payload.examId });
                return this.get(audience, { loading: true }).then(function() {
                    if (audience.data.isGrant === 1) {
                        D.assign(state.data, { isGrant: true });
                    } else {
                        D.assign(state.data, {
                            tips: errors.get('30120')
                        });
                        state.changed();
                    }
                });
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.afterRender = function() {
    var tips = this.store.models.state.data.tips;
    if (tips) {
        this.app.viewport.modal(this.items.tips, { tips: tips });
    }
};
