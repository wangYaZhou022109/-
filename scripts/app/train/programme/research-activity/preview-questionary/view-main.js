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
    },
    hasQuestion: function(data) {
        if (data.state.currentQuestion) return true;
        return false;
    }
};
exports.getEntity = function(id) {
    var question = this.module.store.models.questions.getQuestionById(id) || {},
        newQuestion = JSON.parse(JSON.stringify(question)); // clone一份，不改变对象值
    newQuestion = D.assign({}, newQuestion, {
        questionAttrs: _.orderBy(_.map(newQuestion.questionAttrs, function(qr) {
            if (qr.score) return D.assign(qr, { score: qr.score / 100 });
            return qr;
        }), ['name'], ['asc']),
        score: newQuestion.score / 100
    });
    return newQuestion;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, ANSWER_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        data: question,
        multiple: question.type === MUTIPLE_CHOOSE_TYPE,
        mode: this.module.store.models.research.data.type < 3 ? 0 : 1 // 调研不需要分数
    };
};

