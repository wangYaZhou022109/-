var _ = require('lodash/collection');

exports.title = '纠错详情';

exports.bindings = {
    state: true,
    questions: true
};

exports.dataForTemplate = {
    questionRecoverys: function() {
        var questions = this.bindings.questions.data,
            state = this.bindings.state.data;
        return _.map(_.find(questions, ['id', state.id]).questionRecoverys, function(q, n) {
            var qq = q;
            qq.i = n + 1;
            return qq;
        });
    }
};
