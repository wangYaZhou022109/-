
exports.items = {
    left: 'left',
    right: 'right'
};
exports.store = {
    models: {
        leftstate: { },
        rightstate: { }
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
    // return this.dispatch('init', this.renderOptions);
};
