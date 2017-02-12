exports.items = {
    filter: 'filter',
    main: 'main'
};

exports.store = {
    models: {
        params: {
            data: { isOverdue: '1' }
        },
        state: { data: { menu: 'content' } }
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
