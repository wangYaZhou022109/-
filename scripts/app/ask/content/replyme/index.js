
exports.items = {
    left: 'left',
    right: 'right'
};
exports.store = {
    models: {
        leftstate: { data: { menu: 'replyme' } },
        rightstate: { }
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
};
