exports.title = '问卷须知';

exports.dataForTemplate = {
    research: function() {
        return this.renderOptions.research;
    }
};

exports.buttons = [{
    text: '开始答题',
    fn: function() {
        var id = this.renderOptions.research.id,
            url = '#/exam/research-activity/research-detail/' + id;
        window.open(url, '_blank');
    }
}];
