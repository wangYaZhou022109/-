
exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/organization/company-orgs' },
        state: { data: {} }
    },
    callbacks: {
        initPage: function() {
            var organizationTree = this.models.organizationTree;
            this.get(organizationTree);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('initPage');
};

exports.buttons = [{
    text: '确定选择',
    fn: function() {
        var data = this.store.models.state.data;
        this.renderOptions.callback(data);
    }
}];
