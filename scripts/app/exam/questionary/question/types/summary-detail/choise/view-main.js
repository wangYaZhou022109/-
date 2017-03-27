var MUTIPLE_TYPE = 2;

exports.bindings = {
    question: true
};

exports.dataForTemplate = {
    mutiple: function(data) {
        return data.question.type === MUTIPLE_TYPE;
    }
};
