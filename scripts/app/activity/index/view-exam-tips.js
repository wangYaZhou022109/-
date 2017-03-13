exports.title = '考试须知';

exports.dataForTemplate = {
    exam: function() {
        return this.renderOptions.exam;
    }
};

exports.buttons = [{
    text: '开始考试',
    fn: function() {
        var id = this.renderOptions.exam.id,
            url = '#/exam/exam/answer-paper-2/' + id;
        window.open(url, '_blank');
    }
}];
