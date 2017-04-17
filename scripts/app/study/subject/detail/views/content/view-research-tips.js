exports.title = '问卷须知';
exports.bindings = {
    researchActivity: true,
    state: false,
    subject: false
};

exports.buttons = [{
    text: '开始答题',
    fn: function() {
        var id = this.bindings.researchActivity.data.id,
            state = this.bindings.state.data,
            subject = this.bindings.subject.data,
            url = '#/exam/research-activity/research-detail/' + id + '/' + subject.id;
        if (state.currentType === 13) {
            url = '#/exam/research-activity/paper/' + id + '/' + subject.id;
        }
        window.open(url);
    }
}];
