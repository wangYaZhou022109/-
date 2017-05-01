var types = require('./app/train/programme/exam/exam-question-types'),
    D = require('drizzlejs');

exports.title = '试题预览';

exports.type = 'dynamic';

exports.bindings = {
    question: true,
    state: true
};

exports.getEntity = function(id) {
    var question = this.module.store.models.question.getQuestionById({ id: id });
    if (question) {
        question = D.assign({}, question, { score: question.score / 100 });
    }
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 2);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2
    };
};
