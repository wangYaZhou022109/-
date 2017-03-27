exports.title = '调研与考试';

exports.bindings = {
    questionnaire: true,
    state: true
};

exports.dataForTemplate = {
    questionnaire: function(data) {
        var questionnaire = data.questionnaire;
        return questionnaire;
    }
};
