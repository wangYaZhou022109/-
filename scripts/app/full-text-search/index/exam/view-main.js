exports.bindings = {
    exams: true,
    state: false,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}];

exports.events = {
    'click exam-*': 'showExamPrompt'
};

exports.handlers = {
    showExamPrompt: function(id) {
        var mod = this.module.items['activity/index/exam-prompt'],
            me = this;
        me.app.viewport.modal(mod, { examId: id });
    }
};
