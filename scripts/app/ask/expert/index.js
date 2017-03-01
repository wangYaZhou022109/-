exports.items = {
};

exports.store = {
    models: {
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
