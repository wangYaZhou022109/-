var viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    courses: true,
    down: false,
    state: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'courses' }
}];

exports.dataForTemplate = { courses: viewUtil.dataForTemplate.courses };
