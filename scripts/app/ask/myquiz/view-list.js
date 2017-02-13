exports.type = 'dynamic';
exports.bindings = {
    params: false,
    questions: true,
    question: true
};

exports.events = {
    'click details-*': 'details'
};

exports.handlers = {
    details: function(data) {
        var mod = this.module.items['ask-bar/question/details'],
            question = this.bindings.question.getQuestionById({ id: data });
        this.app.viewport.ground(mod, { question: question });
    }
};
exports.dataForTemplate = {
};
