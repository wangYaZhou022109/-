var D = require('drizzlejs');

exports.title = '选择岗位';
exports.large = true;

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    'human/organization/navigate-tree': { isModule: true, region: 'left', uri: 'human/position' }
};

exports.store = {
    models: {
        positions: { url: '../human/position', type: 'pageable', root: 'items' },
        state: { data: {} },
        search: {
            data: {},
            mixin: { getQueryParams: function() {
                if (this.data.organizationId) return { organizationId: this.data.organizationId };
                return {};
            } }
        }
    },
    callbacks: {
        refreshList: function(options) {
            var data = D.assign({}, this.models.search.getQueryParams(), options),
                model = this.models.positions;
            model.params = data;
            this.get(model);
        }
    }
};

exports.mixin = {
    nodeChanged: function(node) {
        var model = this.store.models.search;
        model.data.organizationId = node.id;
        model.changed();
        this.dispatch('refreshList');
    }
};
