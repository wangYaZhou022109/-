var _ = require('lodash/collection');

exports.bindings = {
    questions: true,
    state: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'questions' }
}];

exports.dataForTemplate = {
    questions: function() {
        var questions = this.bindings.questions.data;
        return _.map(questions, function(q, n) {
            var qq = q;
            qq.i = n + 1;
            return qq;
        });
    }
};

exports.events = {
    'click detail-*': 'detail'
};

exports.handlers = {
    detail: function(id) {
        this.bindings.state.data.id = id;
        this.app.viewport.modal(this.module.items.detail);
    }
};
