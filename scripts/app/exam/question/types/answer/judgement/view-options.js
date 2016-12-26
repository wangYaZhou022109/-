exports.bindings = {
    state: true,
    answer: true
};

exports.dataForTemplate = {
    isCorrect: function() {
        var answer = this.bindings.answer.data;
        if (answer.value.length > 0) return Number(answer.value[0].value) === 1;
        return false;
    },
    isError: function() {
        var answer = this.bindings.answer.data;
        if (answer.value.length > 0) return Number(answer.value[0].value) === 0;
        return false;
    }
};

exports.events = {
    'click check-*': 'check'
};

exports.handlers = {
    check: function(index) {
        var answer = this.bindings.answer;
        answer.set({
            key: this.bindings.state.data.id,
            value: [{
                id: this.$('check-' + index).value,
                value: this.$('check-' + index).value
            }]
        });
        return this.module.dispatch('save');
    }
};
