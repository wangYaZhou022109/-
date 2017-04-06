var _ = require('lodash/collection');
exports.bindings = {
    knowledges: true,
    search: 'changeSearch',
};
exports.changeSearch = function() {
    var params = this.bindings.search.data;
    params.categoryId = params.menu2 || params.menu1;
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
