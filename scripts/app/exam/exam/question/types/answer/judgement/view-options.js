var D = require('drizzlejs');

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
    },
    isShowDetail: function() {
        var mode = this.bindings.state.data.detailMode;
        return mode && mode > 0;
    },
    state: function(data) {
        return D.assign(data.state, {
            errorRate: data.state.errorRate / 10000
        });
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

exports.beforeRender = function() {
    var data = this.bindings.state.data;
    if (data.detailMode === 1) {
        data.isShowAnswer = true;
        data.isShowGainScore = true;
    }
    if (data.detailMode === 2) {
        data.isShowAnswer = false;
        data.isShowGainScore = true;
    } else if (data.detailMode === 3) {
        data.isShowAnswer = false;
        data.isShowGainScore = true;
        this.bindings.answer.data = {};
    }
};
