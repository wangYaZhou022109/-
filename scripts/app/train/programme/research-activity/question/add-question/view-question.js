var types = require('./app/exam/research-question-types'),
    D = require('drizzlejs'),
    EDIT = 3,
    NO_OPTION_SCORE = 0;


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
    return types.get(type, EDIT);
};

exports.dataForEntityModule = function(question) {
    var type = question ? question.type : this.bindings.state.data.type;
    return {
        type: type,
        data: question,
        multiple: Number(type) === 2,
        mode: NO_OPTION_SCORE
    };
};
