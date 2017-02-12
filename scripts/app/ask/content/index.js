exports.items = {
    middle: 'middle',
    top: 'top',
    bottom: 'bottom',
    left: 'left'
};
exports.store = {
    models: {
        state: { data: { menu: 'contentleft' } }
    },
    callbacks: {
        init: function() {
        },
        search: function() {
        }
    }
};


exports.afterRender = function() {
    return this.dispatch('init');
};
