var $ = require('jquery');

exports.bindings = {
    state: true,
    answer: true
};

exports.events = {
    'change answer': 'changeAnswer'
};

exports.handlers = {
    changeAnswer: function() {
        var answer = this.bindings.answer;
        answer.set({
            key: this.bindings.state.data.id,
            value: [{
                id: this.bindings.state.data.id,
                value: $(this.$('answer')).val().trim()
            }]
        });
        return this.module.dispatch('save');
    }
};

exports.dataForTemplate = {
    answer: function() {
        var answer = this.bindings.answer;
        if (answer.data.value.length > 0) return answer.data.value[0].value;
        return '';
    }
};
