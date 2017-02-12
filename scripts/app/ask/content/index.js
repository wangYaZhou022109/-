exports.items = {
    'ask/question': { isModule: true },
    middle: 'middle',
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    'ask/article': { isModule: true }

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
