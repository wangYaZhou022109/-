exports.bindings = {
    state: true
};

exports.afterRender = function() {
    var mod = this.module.items['activity/index/exam-prompt'],
        state = this.bindings.state.data;
    if (state.isGrant) {
        this.app.viewport.modal(mod, {
            examId: this.bindings.state.data.examId,
            toActivityHome: true
        });
    }
};
