var options = require('./app/exam/exam/base-paper/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    bindings = D.assign({}, obj.bindings),
    types = require('./app/exam/exam-question-types'),
    _ = require('lodash/collection'),
    constant = {
        ANSWER_PAPER_MODE: 3,
        NO_DETAIL_MODE: -1 // 除了题目内容，其他答案以及信息看不到
    };

obj.bindings = bindings;
D.assign(obj.bindings, {
    answer: false,
    exam: false
});

D.assign(obj, {
    type: 'dynamic',
    getEntity: function(id) {
        var question;
        question = this.bindings.types.getQuestionById(id);
        question = D.assign({}, question, {
            score: question.score / 100,
            questionAttrs: _.orderBy(question.questionAttrCopys, ['name', 'asc'])
        });
        question.answerRecord = D.assign(
            {},
            question.answerRecord,
            { score: question.answerRecord ? question.answerRecord.score / 100 : 0 }
        );
        return question;
    },
    getEntityModuleName: function(id, question) {
        return types.get(question.type, constant.ANSWER_PAPER_MODE);
    },
    dataForEntityModule: function(question) {
        var exam = this.bindings.exam.data,
            answer = this.bindings.answer;
        return {
            data: question,
            answer: answer.getAnswer(question.id),
            mode: exam.examRecord.status > 5 ? exam.showAnswerRule : 4
        };
    }
});

module.exports = obj;

