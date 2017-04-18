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
            subject = this.bindings.subject.data,
            url = '#/exam/research-activity/paper/' + id + '/' + subject.id;
        window.open(url, '_blank');
    }
}];
