exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/grant/granted-organization' }
    },
    callbacks: {
        initPage: function(uri) {
            this.get(this.models.organizationTree, { data: { uri: uri } });
        }
    }
};

exports.afterRender = function() {
    var uri = this.moduleOptions.uri || this.app.global.uri;
    this.dispatch('initPage', uri);
};
