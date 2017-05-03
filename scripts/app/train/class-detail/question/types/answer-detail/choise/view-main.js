var MUTIPLE_TYPE = 2,
    _ = require('lodash/collection');

exports.bindings = {
    question: true
};

exports.dataForTemplate = {
    mutiple: function(data) {
        return data.question.type === MUTIPLE_TYPE;
    },
    idea: function(data) {
        var answerRecords = data.question.answerRecords,
            id = data.question.researchRecordId,
            idea = {};
        _.forEach(answerRecords, function(d) {
            if (d.researchRecordId === id) {
                idea.data = d.idea;
            }
        });
        return idea;
    }
};
