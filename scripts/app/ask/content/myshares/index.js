
exports.items = {
    left: 'left',
    right: 'right',
};

exports.store = {
    models: {
        leftstate: { data: { menu: 'myshares' } },
        rightstate: {}
    },
    callbacks: {
        refresh: function() {
            this.models.rightstate.changed();
        }
    }
};

exports.afterRender = function() {
};
