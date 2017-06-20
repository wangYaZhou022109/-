exports.items = {
    main: 'main',
    head: 'head'
};

exports.title = '查看答题明细';

exports.large = true;

exports.store = {
    models: {
        question: {},
        answers: { url: '../exam/research-activity/summary-detail/question', type: 'pageable', root: 'items' }
    },
    callbacks: {
        init: function(payload) {
            var answers = this.models.answers;
            this.models.question.set(payload.question);
            answers.params = { questionId: payload.question.id, researchId: payload.question.researchQuestionary.id };
            return this.get(answers);
        },
        search: function(payload) {
            var answers = this.models.answers;
            answers.params.answer = payload.answer;
            return this.get(answers);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
