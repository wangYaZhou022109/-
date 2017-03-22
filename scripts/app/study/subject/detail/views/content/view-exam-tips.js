
exports.title = '温馨提醒';
exports.small = true;

exports.bindings = {
    state: false
};

exports.buttons = [{
    text: '开始考试',
    fn: function() {
        var id = this.bindings.state.examId,
            url = '#/exam/exam/answer-paper/' + id;
        window.open(url, '_blank');
    }
}];
