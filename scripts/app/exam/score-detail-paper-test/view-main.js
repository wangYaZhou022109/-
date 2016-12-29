var types = require('./app/exam/types'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.bindings = {
    state: true,
    exam: true,
    questions: true,
    answer: true,
    questionTypes: true
};

exports.type = 'dynamic';

exports.components = [{
    id: 'paper-view-type',
    name: 'selectize'
}];

exports.events = {
    'change paper-view-type': 'changePaperViewType',
    'click prev': 'prev',
    'click next': 'next'
};

exports.handlers = {
    changePaperViewType: function() {
        return this.module.dispatch('changePaperViewType', { type: this.$('paper-view-type').value });
    },
    prev: function() {
        return this.module.dispatch('move', -1);
    },
    next: function() {
        return this.module.dispatch('move', 1);
    }
};

exports.dataForTemplate = {
    paperViewTypes: function() {
        var paperViewTypes = maps.get('paper-view-type'),
            data = this.bindings.state.data;
        if (data.isOnePageOneQuestion) {
            paperViewTypes[0].selected = true;
        } else {
            paperViewTypes[1].selected = true;
        }
        return paperViewTypes;
    },
    questions: function() {
        return this.bindings.questions.data;
    }
};

exports.getEntity = function(id) {
    var question = this.bindings.exam.getQuestionById(id),
        questionTypes = this.bindings.questionTypes;

    D.assign(question, {
        errorRate: question.errorRate / 10000,
        questionAttrs: _.orderBy(question.questionAttrCopys, ['name'], ['asc']),
        answerRecord: D.assign(question.answerRecord, { score: question.answerRecord.score / 100 }),
        index: questionTypes.getQuestionIndexInType(id)
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 3);
};

exports.dataForEntityModule = function(question) {
    return {
        data: question,
        multiple: question.type === 2,
        answer: this.bindings.answer.getAnswer(question.id),
        mode: 2
    };
};

