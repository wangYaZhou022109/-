var errors = require('./app/util/errors'),
    D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(payload) {
            D.assign(payload, {
                message: errors.get(payload.code)
            });
            this.models.state.set(payload);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
