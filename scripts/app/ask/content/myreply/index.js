
exports.items = {
    left: 'left',
    right: 'right'
};
exports.store = {
    models: {
        leftstate: { data: { menu: 'myreply' } },
        rightstate: { }
    },
    callbacks: {
        leftrefresh: function() {
            this.models.leftstate.changed();
        }
    }
};

exports.afterRender = function() {
};
