var viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    state: false,
    knowledges: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'knowledges' }
}];

exports.dataForTemplate = { knowledges: viewUtil.dataForTemplate.knowledges };

exports.events = {
    'click details-*': 'detail'
};

exports.handlers = {
    detail: function(id) {
        window.location.href = '#/knowledge/detail/' + id;
    }
};
