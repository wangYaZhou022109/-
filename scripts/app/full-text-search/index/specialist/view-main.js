var viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    specialist: true,
    state: false,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'specialist' }
}];

exports.dataForTemplate = { specialist: viewUtil.dataForTemplate.specialist };
