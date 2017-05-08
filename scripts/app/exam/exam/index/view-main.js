exports.bindings = {
    state: true
};

exports.afterRender = function() {
    var mod = this.module.items['activity/index/exam-prompt'];
    this.app.viewport.modal(mod, {
        examId: this.bindings.state.data.examId,
        toActivityHome: true
    });
};
