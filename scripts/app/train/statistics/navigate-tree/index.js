exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/grant/granted-organization' },
        state: { data: {} }
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

exports.buttons = [{
    text: '确定选择',
    fn: function() {
        var data = this.store.models.state.data;
        this.renderOptions.callback(data);
    }
}];
