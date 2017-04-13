exports.title = '问卷须知';
exports.bindings = {
    researchActivity: true,
    state: false
};

exports.buttons = [{
    text: '开始答题',
    fn: function() {
        var id = this.bindings.researchActivity.data.id,
            state = this.bindings.state.data,
            url = '#/exam/research-activity/research-detail/' + id;
        if (state.currentType === 13) {
            url = '#/exam/research-activity/paper/' + id;
        }
        window.open(url, '_blank');
    }
}];
