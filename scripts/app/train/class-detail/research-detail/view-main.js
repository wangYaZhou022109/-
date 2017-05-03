var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    types = require('./app/train/class-detail/research-question-types'),
    ANSWER_MODE = 3,
    MUTIPLE_CHOOSE = 2,
    MUTIPLE_TYPE = 1;

exports.type = 'dynamic';

exports.bindings = {
    researchRecord: true,
    questions: false,
    answer: false,
    dimensions: true,
    state: true
};

exports.getEntity = function(id) {
    var question = this.module.store.models.questions.getQuestionById(id);
    question = D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc'])
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, ANSWER_MODE);
};

exports.dataForEntityModule = function(question) {
    var me = this;
    return {
        type: question.type,
        data: question,
        multiple: question.type === MUTIPLE_CHOOSE,
        answer: this.bindings.answer.getAnswer(question.id),
        callback: function(data) {
            return me.module.dispatch('saveAnswer', data);
        }
    };
};

exports.dataForTemplate = {
    isMutiple: function(data) {
        return data.researchRecord.researchQuestionary.answerPaperRule === MUTIPLE_TYPE;
    }
};
