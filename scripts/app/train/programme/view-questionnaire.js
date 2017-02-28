var _ = require('lodash/collection');

exports.bindings = {
    questionnaireList: true,
    state: false
};

exports.dataForTemplate = {
    questionnaireList: function(data) {
        _.map(data.questionnaireList || [], function(qnr, i) {
            var r = qnr;
            r.i = i + 1;
        });
        return data.questionnaireList;
    }
};
