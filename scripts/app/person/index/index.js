exports.items = {
    top: 'top',
    menu: 'menu',
    main: 'main',
    notice: 'notice',
    'person/index/projects': { isModule: true },
    'person/index/classinfos': { isModule: true }
};
exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'archives';
            state.data.archives = true;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
