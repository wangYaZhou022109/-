var strings = require('./app/util/strings');

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    questionaryDetail: function(data) {
        return data.researchRecord.researchQuestionary.questionaryDetail;
    }
};

exports.title = function() {
    return strings.get('exam.research.questionary-detail');
};

exports.buttons = [{
    text: strings.get('exam.begin-answer-question'),
    fn: function() {
        return true;
    }
}];
