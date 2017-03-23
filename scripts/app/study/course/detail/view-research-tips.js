exports.title = '问卷须知';
exports.bindings = {
    researchActivity: true
};

exports.buttons = [{
    text: '开始答题',
    fn: function() {
        var id = this.bindings.researchActivity.data.id,
            url = '#/exam/research-activity/research-detail/' + id;
        window.open(url, '_blank');
    }
}];
