var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.bindings = {
    knowledges: true,
    search: 'changeSearch',
};
exports.changeSearch = function() {
    var params = D.assign({}, this.bindings.search.data);
    params.categoryId = params.menu2 || params.menu1;
    if (params.topicIds) {
        params.topicId = params.topicIds.join();
        delete params.topicIds;
    }
    this.module.dispatch('searchKnowledges', { params: params });
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'knowledges' }
}];

exports.dataForTemplate = {
    knowledges: function(data) {
        var defaultIcons = 'icon-zhishiku';
        var icons = ['icon-mp4', 'icon-mp3', 'icon-word', 'icon-pdf', 'icon-excel',
            'icon-ppt', 'icon-note', 'icon-zhishiku'];
        return _.map(data.knowledges, function(k) {
            var know = k || {};
            know.avgScore *= 10;
            know.icon = icons[know.type] || defaultIcons;
            if (know.name.lastIndexOf('.') !== -1) {
                know.name = know.name.substring(0, know.name.lastIndexOf('.'));
            }
            return know;
        });
    }
};

exports.events = {
    'click details-*': 'detail'
};

exports.handlers = {
    detail: function(id) {
        window.location.href = '#/knowledge/detail/' + id;
    }
};
