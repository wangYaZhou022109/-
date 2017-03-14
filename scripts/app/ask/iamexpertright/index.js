exports.items = {
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        topstate: {},
        middlestate: {},
        bottomstate: {}
    },
    callbacks: {
        init: function() {
        },
        search: function() {
        }
    }
};

exports.afterRender = function() {
    // return this.dispatch('init', this.renderOptions);
};
