var D = require('drizzlejs');
exports.items = {
    title: 'title',
    types: 'types',
    contents: 'contents'
};

exports.title = '选择话题';

exports.buttons = [{
    text: '选择'
}];
exports.store = {
    models: {
        topics: { url: '../system/topic/select', autoLoad: 'after' },
        state: { data: {} },
        search: {
            data: {},
            mixin: { getQueryParams: function() {
                if (this.data.organizationId) return { organizationId: this.data.organizationId };
                return {};
            } }
        },
        types: { url: '../system/topic-type', autoLoad: 'after' }
    },
    callbacks: {
        refreshList: function(options) {
            var data = D.assign({}, this.models.search.getQueryParams(), options),
                model = this.models.topics;
            model.params = data;
            this.get(model);
        }
    }
};
