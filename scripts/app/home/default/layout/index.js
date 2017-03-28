exports.items = {
    layout: 'layout'
};
exports.store = {
    models: {
        contents: { url: '../system/home-content' },
        styleMap: { data: { 'layout-1': 7, 'layout-2': 6, 'layout-3': 4, 'layout-4': 7, 'layout-5': 8 } }
    },
    callbacks: {
        init: function(payload) {
            var contents = this.models.contents,
                style = payload.style || 'layout-1';
            contents.clear();
            contents.params.moduleHomeConfigId = payload.id;
            contents.params.size = this.models.styleMap.data[style] || 7;
            contents.params.clientType = payload.clientType || 1;
            return this.get(contents);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
