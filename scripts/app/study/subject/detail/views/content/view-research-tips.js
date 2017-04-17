exports.title = '问卷须知';
exports.bindings = {
    researchActivity: true,
    state: false
};

exports.buttons = [{
    text: '开始答题',
    fn: function() {
        var id = this.bindings.researchActivity.data.id,
            url = '#/exam/research-activity/paper/' + id;
        window.open(url);
    }
}];
