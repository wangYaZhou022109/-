var viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    askBar: true,
    state: false,
    down: false
};

exports.events = {
    'click question-*': 'questionDetail'
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'askBar' }
}];

exports.handlers = {
    questionDetail: function(id) {
        window.open('#/ask/questiondetails/' + id);
    }
};

exports.dataForTemplate = { askBar: viewUtil.dataForTemplate.askBar };
