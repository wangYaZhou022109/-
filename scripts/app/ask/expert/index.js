exports.items = {
    left: 'left',
    // right: 'right'
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        leftstate: {},
        // rightstate: {}
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
};
