var viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    topics: true,
    state: false,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'topics' }
}];

exports.dataForTemplate = { topics: viewUtil.dataForTemplate.topics };
