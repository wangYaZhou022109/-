var types = require('./app/exam/research-question-types'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    DETAIL_SUMMARY_MODE = 2;

exports.bindings = {
    summaryDetail: true,
    questions: true
};

exports.type = 'dynamic';

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber');

        if (data.summaryDetail) {
            return _.map(data.summaryDetail.dimensions, function(d, i) {
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
    return types.get(question.type, DETAIL_SUMMARY_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        question: question
    };
};
