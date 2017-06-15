var types = require('./app/train/programme/research-activity/research-question-types'),
    D = require('drizzlejs'),
    EDIT = 3,
    _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntity = function() {
    var question = this.module.renderOptions.question,
        newQuestion = {};
    if (question) {
        newQuestion = JSON.parse(JSON.stringify(question)); // clone一份，不改变对象值
        newQuestion = D.assign({}, newQuestion, {
            questionAttrs: _.orderBy(_.map(newQuestion.questionAttrs, function(qr) {
                if (qr.score) return D.assign(qr, { score: qr.score / 100 });
                return qr;
            }), ['name'], ['asc']),
            score: newQuestion.score / 100
        });
        return newQuestion;
    }
    return question;
};

exports.getEntityModuleName = function(type) {
    return types.get(type, EDIT);
};

exports.dataForEntityModule = function(question) {
    var type = question ? question.type : this.bindings.state.data.type;
    return {
        type: type,
        data: question,
        multiple: Number(type) === 2,
        mode: this.module.renderOptions.hideScore ? 0 : 1
    };
};
