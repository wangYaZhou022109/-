exports.items = {
    left: 'left',
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        leftstate: {},
        topstate: {},
        middlestate: {},
        bottomstate: {}
    },
    callbacks: {
        refresh: function() {
            this.models.middlestate.changed();
        }
    }
};

exports.afterRender = function() {
    // return this.dispatch('init', this.renderOptions);
};
