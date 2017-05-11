var options = require('./app/train/programme/exam/paper/base-paper/view-main'),
    D = require('drizzlejs'),
    types = require('./app/train/programme/exam/exam-question-types'),
    _ = require('lodash/collection');


var setOptions = {
    type: 'dynamic',
    getEntity: function(id) {
        var question = this.bindings.types.getQuestionById(id),
            entity = D.assign({}, question);

        entity = D.assign(entity, {
            score: question.score / 100,
            errorRate: question.errorRate / 10000,
            questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc']),
        });
        return entity;
    },
    getEntityModuleName: function(id, question) {
        return types.get(question.type, 3);
    },
    dataForEntityModule: function(question) {
        return {
            data: question,
            multiple: question.type === 2,
            mode: -1
        };
    }
};

var target = D.assign({}, options, setOptions);
module.exports = target;
