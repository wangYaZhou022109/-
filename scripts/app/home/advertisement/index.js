exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        advertisement: { url: '../system/home-advertisement' }
    },
    callbacks: {
        init: function(payload) {
            var model = this.models.advertisement;
            model.clear();
            model.set(payload);
            return this.get(model);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
