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
        var defaultIcons = 'icon-other';
        var icons = ['icon-mp4', 'icon-mp3', 'icon-word', 'icon-pdf', 'icon-excel',
            'icon-ppt', 'icon-other', 'icon-other'];
        return _.map(data.knowledges, function(k) {
            var know = k || {};
            var index = know.name.lastIndexOf('.');
            var reg = /^[0-9a-zA-Z]*$/g;
            know.browseCount = (know.browseCount == null) ? 0 : know.browseCount;
            know.downloadMemberCount = (know.downloadMemberCount == null) ? 0 : know.downloadMemberCount;
            know.avgScore *= 10;
            know.icon = icons[know.type] || defaultIcons;
            if (index !== -1 && reg.test(know.name.substring(index + 1))
                && know.name.substring(index + 1).length < 5) {
                know.name = know.name.substring(0, index);
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
