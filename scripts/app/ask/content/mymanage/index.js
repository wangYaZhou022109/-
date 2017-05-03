
exports.items = {
    left: 'left',
    right: 'right'
};
exports.store = {
    models: {
        leftstate: { data: { menu: 'mymanage' } },
        rightstate: { }
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
};
