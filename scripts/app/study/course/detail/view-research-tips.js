exports.title = '问卷须知';
exports.bindings = {
    researchActivity: true,
    state: false,
    course: false
};

exports.buttons = [{
    text: '开始答题',
    fn: function() {
        var id = this.bindings.researchActivity.data.id,
            state = this.bindings.state.data,
            course = this.bindings.course.data,
            url = '#/exam/research-activity/paper/' + id + '/' + course.id;
        if (state.currentType === 13) {
            url = '#/exam/research-activity/paper/' + id + '/' + course.id;
        }
        window.open(url, '_blank');
    }
}];
