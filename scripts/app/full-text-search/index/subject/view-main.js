var _ = require('lodash/collection'),
    viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    subjects: true,
    down: false,
    state: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'subjects' }
}];

exports.dataForTemplate = { subjects: viewUtil.dataForTemplate.subjects };

exports.events = {
    'click openDetail-*': 'openDetail'
};

exports.handlers = {
    openDetail: function(id) {
        var subject = _.find(this.bindings.subjects.data || [], { id: id }),
            url = subject.url || '#/study/subject/detail/' + id;
        window.open(url);
        if (subject.url) this.module.dispatch('register', { id: id });
    }
};
