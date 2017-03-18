
exports.title = '温馨提醒';
exports.small = true;

exports.dataForTemplate = {
    research: function() {
        return this.renderOptions.research;
    }
};

exports.buttons = [{
    text: '开始考试',
    fn: function() {
        var id = this.renderOptions.research.id,
            url = '#/exam/index/' + id;
        window.open(url, '_blank');
    }
}];
