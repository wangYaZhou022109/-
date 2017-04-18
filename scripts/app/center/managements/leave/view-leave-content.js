exports.events = {
    'click exam-verify-*': 'showExamverify'
};

exports.handlers = {
    showExamverify: function() {
        var model = this.module.items['center/managements/leave/exam-verify'];
        this.app.viewport.modal(model);
    }
};
