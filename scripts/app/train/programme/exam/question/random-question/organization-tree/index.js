exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/grant/granted-organization' }
    },
    callbacks: {
        initPage: function(uri) {
            return this.get(this.models.organizationTree, { data: { uri: uri } });
        }
    }
};

exports.afterRender = function() {
    var uri = this.renderOptions.url || this.app.global.uri;
    return this.dispatch('initPage', uri);
};
