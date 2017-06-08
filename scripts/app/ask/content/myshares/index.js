
exports.items = {
    left: 'left',
    // right: 'right',
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        leftstate: { data: { menu: 'myshares' } },
        // rightstate: {}
        topstate: {},
        middlestate: {},
        bottomstate: {}
    },
    callbacks: {
        refresh: function() {
            this.models.middlestate.changed();
        },
        leftrefresh: function() {
            this.models.leftstate.changed();
        }
    }
};

exports.afterRender = function() {
};
