var types = require('./app/train/programme/exam/exam-question-types'),
    D = require('drizzlejs');


exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntity = function() {
    var question = this.module.renderOptions.question;
    if (question) {
        question = D.assign({}, question, { score: question.score / 100 });
    }
    return question;
};

exports.getEntityModuleName = function(type) {
    return types.get(type, 1);
};

exports.dataForEntityModule = function(question) {
    var type = question ? question.type : this.bindings.state.data.type;
    return {
        type: type,
        data: question,
        multiple: Number(type) === 2
    };
};
