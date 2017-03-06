exports.items = {
    left: 'left',
    right: 'right'
};

exports.store = {
    models: {
        leftstate: {},
        rightstate: {}
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
