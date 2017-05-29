exports.items = {
    tree: 'tree'
};

exports.store = {
    models: {
        organizationTree: { url: '../system/organization/company-orgs' }
    },
    callbacks: {
        initPage: function() {
            return this.get(this.models.organizationTree);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('initPage');
};
