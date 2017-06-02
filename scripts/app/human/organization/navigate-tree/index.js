exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/organization/company-orgs' }
    },
    callbacks: {
        initPage: function() {
            this.get(this.models.organizationTree);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('initPage');
};
