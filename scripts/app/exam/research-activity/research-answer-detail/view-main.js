var types = require('./app/exam/research-question-types'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    ANSWER_SUMMARY_MODE = 1;

exports.bindings = {
    researchRecord: true,
    questions: true
};

exports.type = 'dynamic';

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber');

        if (data.researchRecord.researchQuestionary) {
            return _.map(data.researchRecord.researchQuestionary.dimensions, function(d, i) {
                return D.assign(d, {
                    dimensionIndex: _.find(chineseNumber, ['key', (i + 1).toString()]).value,
                    questions: _.map(d.questions, function(q, n) {
                        return D.assign(q, {
                            questionIndex: n + 1,
                            typeDesc: _.find(questionTypes, ['key', q.type.toString()]).value + '题'
                        });
                    })
                });
            });
        }
        return [];
    }
};

exports.getEntity = function(id) {
    var question = this.bindings.questions.getQuestionById(id);
    return D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['createTime'], ['asc']),
        score: question.score / 100
    });
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, ANSWER_SUMMARY_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        question: question
    };
};
