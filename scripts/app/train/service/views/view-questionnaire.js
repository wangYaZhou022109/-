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

exports.events = {
    'click edit-exams*': 'edit'
};

exports.handlers = {
    edit: function(data) {
        var id = data,
            url = '#/exam/exam/answer-paper/' + id;
        window.open(url, '_blank');
    }
};
