var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    viewUtil = require('./app/full-text-search/view-util');
exports.bindings = {
    courses: true,
    subjects: true,
    mooc: true,
    classes: true,
    exams: true,
    researchs: true,
    lives: true,
    askBar: true,
    articles: true,
    specialist: true,
    topics: true,
    knowledges: true,
    down: false,
    state: false
};

exports.dataForTemplate = D.assign({}, viewUtil.dataForTemplate);

exports.events = {
    'click openDetail-*': 'openDetail',
    'click exam-*': 'showExamPrompt',
    'click more-*': 'openMore',
    'click knowledge-*': 'knowledgeDetail',
    'click question-*': 'questionDetail',
    'click attendLive-*': 'attendLive'
};

exports.handlers = {
    openDetail: function(id) {
        var subject = _.find(this.bindings.subjects.data || [], { id: id }),
            url = subject.url || '#/study/subject/detail/' + id;
        window.open(url);
        if (subject.url) this.module.dispatch('register', { id: id });
    },
    showExamPrompt: function(id) {
        var mod = this.module.items['activity/index/exam-prompt'],
            me = this;
        me.app.viewport.modal(mod, { examId: id });
    },
    openMore: function(key) {
        this.module.renderOptions.callback.call(this, { key: viewUtil.typeMaps[key] });
    },
    knowledgeDetail: function(id) {
        window.open('#/knowledge/detail/' + id);
    },
    questionDetail: function(id) {
        window.open('#/ask/questiondetails/' + id);
    },
    attendLive: function(id) {
        window.open('#/activity/gensee/detail/' + id);
    }
};
