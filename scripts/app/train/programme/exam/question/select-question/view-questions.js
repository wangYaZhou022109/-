var types = require('./app/train/programme/exam/exam-question-types'),
    _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.type = 'dynamic';

exports.bindings = {
    questions: true,
    state: true
};

exports.events = {
    'click select-*': 'selectQuestion',
    'click check-all': 'checkAll'
};

exports.handlers = {
    selectQuestion: function(data, target) {
        var question = this.bindings.questions.getQuestionById(data),
            addQuestionClass = this.module.renderOptions.callback.addQuestionClass,
            removeQuestionClass = this.module.renderOptions.callback.removeQuestionClass;
        if (target.target.checked) {
            addQuestionClass(D.assign(question, { isFromSelected: 1 }));
        } else {
            removeQuestionClass(question.id);
        }
    },
    checkAll: function(data, target) {
        var questions = this.bindings.questions.data,
            state = this.bindings.state,
            addQuestionClasses = this.module.renderOptions.callback.addQuestionClasses,
            removeQuestionClasses = this.module.renderOptions.callback.removeQuestionClasses;
        if (target.checked) {
            state.data.checkAll = true;
            addQuestionClasses(_.map(questions, function(q) {
                return D.assign(q, { isFromSelected: 1 });
            }));
        } else {
            state.data.checkAll = false;
            removeQuestionClasses(questions);
        }
        return this.module.dispatch('refresh');
    }
};

exports.dataForTemplate = {
    questions: function(data) {
        var callback = this.module.renderOptions.callback,
            map = {},
            ids = callback.getQuestionIds(),
            questions;

        ids = callback.getQuestionIds();
        if (ids) {
            _.forEach(ids, function(i) {
                map[i] = i;
            });
        }

        questions = _.map(data.questions, function(q, i) {
            var question = q;
            if (map[question.id]) {
                question.checked = true;
            }
            question.i = i + 1;
            return question;
        });

        this.bindings.state.data.checkAll = _.every(data.questions, function(q) {
            return q.checked;
        });

        return questions;
    },
    checkAll: function() {
        return this.bindings.state.data.checkAll;
    }
};

exports.getEntity = function(id) {
    var question = this.module.store.models.questions.getQuestionById(id);
    return D.assign({}, question, {
        score: question.score / 100
    });
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 2);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2,
        previewMode: 1
    };
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'questions' }
}];
