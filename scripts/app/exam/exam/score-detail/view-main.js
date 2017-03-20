var types = require('./app/exam/exam-question-types'),
    D = require('drizzlejs'),
    constant = {
        ANSWER_PAPER_MODE: 3,
        NO_DETAIL_MODE: -1 // 除了题目内容，其他答案以及信息看不到
    };

exports.bindings = {
    state: true,
    types: false,
    answer: false,
    exam: false
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question;

    question = this.bindings.types.getQuestionById(id);
    question = D.assign(question, {
        score: question.score / 100,
        questionAttrs: question.questionAttrCopys
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, constant.ANSWER_PAPER_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        data: question,
        answer: this.bindings.answer.getAnswer(question.id),
        mode: this.bindings.exam.data.showAnswerRule
    };
};

