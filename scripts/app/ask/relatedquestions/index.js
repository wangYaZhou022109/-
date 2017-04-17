exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        questions: { url: '../ask-bar/question/relevant-questions' }
    },
    callbacks: {
        init: function(payload) {
            var questions = this.models.questions;
            console.log(payload);
            questions.set({ id: payload.state.id });
            return this.get(questions);
        }
    }
};

exports.afterRender = function() {
   // console.log(this.renderOptions);
    if (typeof this.renderOptions.state.id !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
