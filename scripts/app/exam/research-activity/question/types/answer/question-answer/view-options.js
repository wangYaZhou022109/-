var $ = require('jquery'),
    D = require('drizzlejs');

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

