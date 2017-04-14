var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    types = require('./app/train/programme/research-activity/research-question-types'),
    MUTIPLE_CHOOSE_TYPE = 2,
    ANSWER_MODE = 4;

exports.type = 'dynamic';

exports.bindings = {
    research: true,
    questions: true,
    state: true
};

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber');

        return _.map(data.research.dimensions, function(d, i) {
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
    },
    isMutiple: function(data) {
        return data.research.answerPaperRule === 1;
    }
};

exports.getEntity = function(id) {
    var question = this.module.store.models.questions.getQuestionById(id);
    question = D.assign(question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc'])
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, ANSWER_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        data: question,
        multiple: question.type === MUTIPLE_CHOOSE_TYPE,
        mode: this.module.renderOptions.hideScore ? 0 : 1
    };
};

