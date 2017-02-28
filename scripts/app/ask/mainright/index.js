exports.items = {
    top: 'top'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
        },
        search: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
