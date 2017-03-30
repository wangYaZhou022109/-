exports.title = '错题举报';

exports.bindings = {
    state: true
};

exports.small = true;

exports.buttons = [{
    text: '确定',
    fn: function() {
        var callback = this.renderOptions.callback;
        if (callback) {
            callback({
                questionId: this.renderOptions.questionId,
                content: this.$('reason').value
            });
        }
        return this.module.dispatch('saveCorrect', {
            questionId: this.renderOptions.questionId,
            reason: this.$('reason').value
        });
    }
}];
