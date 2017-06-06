var options = require('./app/exam/exam/base-paper/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    bindings = D.assign({}, obj.bindings),
    types = require('./app/exam/exam-question-types'),
    _ = require('lodash/collection'),
    constant = {
        ANSWER_PAPER_MODE: 3,
        NO_DETAIL_MODE: -1, // 除了题目内容，其他答案以及信息看不到
        TO_BE_OVER: 5,
        SINGLE: 1,
        MUTIPLE: 2,
        JUDGE: 3,
        SORT: 8
    };

obj.bindings = bindings;
D.assign(obj.bindings, {
    answer: false,
    exam: false
});

D.assign(obj, {
    type: 'dynamic',
    getEntity: function(id) {
        var question = this.bindings.types.getQuestionById(id),
            target = D.assign({}, question),
            subs = _.map(question.subs, function(sub) {
                var s = D.assign({}, sub);
                return D.assign(s, {
                    questionAttrs: _.orderBy(sub.questionAttrCopys, ['name', 'asc']),
                    errorRate: s.errorRate / 10000,
                    answerRecord: s.answerRecord === null
                        ? { score: 0 } : D.assign({}, s.answerRecord, {
                            score: s.answerRecord ? s.answerRecord.score / 100 : 0
                        })
                });
            });
        return D.assign(target, {
            errorRate: target.errorRate / 10000,
            questionAttrs: _.orderBy(question.questionAttrCopys, ['name', 'asc']),
            answerRecord: !target.answerRecord || target.answerRecord === null
                ? { score: 0 } : D.assign({}, target.answerRecord, { score: target.answerRecord.score / 100 }),
            subs: subs
        });
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
            mode: exam.examRecord.status > constant.TO_BE_OVER
                || (question.type === constant.SINGLE
                    || question.type === constant.MUTIPLE
                    || question.type === constant.JUDGE
                    || question.type === constant.SORT
                ) ? exam.showAnswerRule : 4,
            subMode: exam.showAnswerRule
        };
    }
});

module.exports = obj;

