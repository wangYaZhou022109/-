exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        markPapers: {
            url: '../exam/'
        }
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
}
