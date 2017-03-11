
var D = require('drizzlejs');

exports.title = '选择话题';
exports.large = true;

// exports.items = {
//     content: 'content',
//     toolbox: 'toolbox'
// };

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
            if (data.typeId === '0') {
                data.typeId = '';
            }
            model.params = data;
            this.get(model);
        }
    }
};

