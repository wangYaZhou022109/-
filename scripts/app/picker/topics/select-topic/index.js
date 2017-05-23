var D = require('drizzlejs');
exports.items = {
    title: 'title',
    types: 'types',
    contents: 'contents'
};

exports.title = '选择标签';

exports.buttons = [{
    text: '选择'
}];
exports.store = {
    models: {
        topics: { url: '../system/topic/select', autoLoad: 'after' },
        state: { data: {} },
        search: { data: {} },
        types: { url: '../system/topic-type', autoLoad: 'after' }
    },
    callbacks: {
        init: function(payload) {
            var topics = this.models.topics;
            topics.clear();
            if (payload.group) {
                topics.params.group = payload.group;
                D.assign(this.models.search.data, { group: payload.group });
            }
            return this.get(topics);
        },
        changeSearch: function(payload) {
            var search = this.models.search;
            search.set(D.assign(search.data, payload), true);
        },
        refreshList: function(options) {
            var model = this.models.topics;
            model.params = options;
            this.get(model);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
