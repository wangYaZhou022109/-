var types = require('./app/train/class-detail/research-question-types'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    ANSWER_DETAIL_MODE = 2,
    MUTIPLE_TYPE = 1;

exports.bindings = {
    researchRecord: true,
    dimensions: true,
    state: true,
    questions: false
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question = this.bindings.questions.getQuestionById(id);
    return D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc']),
        score: question.score / 100
    });
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, ANSWER_DETAIL_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        question: question
    };
};

exports.dataForTemplate = {
    isMutiple: function(data) {
        if (data.researchRecord.researchQuestionary) {
            return data.researchRecord.researchQuestionary.answerPaperRule === MUTIPLE_TYPE;
        }
        return true;
    },
    dimensions: function(data) {
        var dim = _.orderBy(data.dimensions, ['order'], ['asc']);
        return _.map(dim, function(d) {
            return D.assign(d, {
                singleMode: data.researchRecord.researchQuestionary.answerPaperRule === 2
            });
        });
    }
};
