exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/grant/granted-organization' }
    },
    callbacks: {
        initPage: function(uri) {
            this.models.organizationTree.set(uri);
            return this.get(this.models.organizationTree);
        }
    }
};

exports.afterRender = function() {
    var uri = this.renderOptions.url || this.app.global.uri;
    // var uri = 'course-study/course-info';
    return this.dispatch('initPage', { uri: uri });
};
