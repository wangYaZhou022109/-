var viewUtil = require('./app/full-text-search/view-util');
exports.bindings = {
    lives: true,
    state: false,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'lives' }
}];

exports.dataForTemplate = { lives: viewUtil.dataForTemplate.lives };

exports.events = {
    'click attendLive-*': 'attendLive'
};

exports.handlers = {
    attendLive: function(id) {
        window.open('#/activity/gensee/detail/' + id);
    }
};
