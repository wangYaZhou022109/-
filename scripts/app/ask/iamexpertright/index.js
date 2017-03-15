exports.items = {
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        topstate: { data: { menu: 'myshare' } },
        middlestate: { data: { menu: 'mynoticer' } },
        bottomstate: { data: { menu: 'noticer' } }
    },
    callbacks: {
        init: function() {
        },
        search: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
