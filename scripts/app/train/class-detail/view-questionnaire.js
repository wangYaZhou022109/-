var _ = require('lodash/collection');

exports.title = '调研与考试';

exports.bindings = {
    questionnaire: true,
    state: true,
    trainee: false
};

exports.dataForTemplate = {
    questionnaire: function(data) {
        var questionnaire = data.questionnaire;
        var trainee = this.bindings.trainee.data || {};
        _.map(questionnaire || {}, function(q) {
            var u = q;
            if (trainee.id) {
                u.isGrant = true;
            } else {
                u.isGrant = false;
            }
            return u;
        });
        return questionnaire;
    }
};

exports.events = {
    'click edit-exams*': 'editExam',
    'click edit-questionary*': 'editQuestionary',
};

exports.handlers = {
    editExam: function(data) {
        var id = data,
            url = '#/exam/exam/answer-paper/' + id;
        window.open(url, '_blank');
    },
    editQuestionary: function(data) {
        var id = data,
            url = '#/exam/research-activity/paper/' + id + '/' + this.module.renderOptions.classId;
        window.open(url, '_blank');
    }
};
