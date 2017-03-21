exports.items = {
    layout: 'layout'
};

exports.store = {
    models: {
        contents: { url: '../system/home-content/pages', root: 'items', type: 'pageable' }
    },
    callbacks: {
        init: function(payload) {
            var contents = this.models.contents;
            contents.clear();
            contents.params.moduleHomeConfigId = payload.id;
            return this.get(contents);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
