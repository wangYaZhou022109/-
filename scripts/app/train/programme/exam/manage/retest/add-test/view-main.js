
exports.type = 'dynamic';

exports.bindings = {
    state: true,
    exam: true,
    retest: true
};

exports.getEntity = function() {
    return {
        retest: this.bindings.retest.data,
        exam: this.bindings.exam.data,
        num: this.bindings.state.data.num,
        latestExamId: this.bindings.state.data.latestExamId
    };
};

exports.getEntityModuleName = function(step) {
    return 'exam/exam/manage/retest/add-test/step-' + step;
};

exports.dataForEntityModule = function(data) {
    return data;
};

exports.afterRender = function() {
    this.module.trigger('module.main.view.rendered');
};
