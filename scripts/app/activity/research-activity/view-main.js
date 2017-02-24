var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    types = require('./app/exam/types'),
    ANSWER_MODE = 3,
    MUTIPLE_CHOOSE = 2;

exports.type = 'dynamic';

exports.bindings = {
    researchRecord: true,
    questions: false,
    answer: false
};

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber'),
            dimensions = data.researchRecord.researchQuestionary.dimensions;

        return _.map(dimensions, function(d, i) {
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
};

exports.getEntity = function(id) {
    var question = this.module.store.models.questions.getQuestionById(id);
    question = D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['createTime'], ['asc'])
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
            me.bindings.answer.saveAnswer(data);
        }
    };
};

