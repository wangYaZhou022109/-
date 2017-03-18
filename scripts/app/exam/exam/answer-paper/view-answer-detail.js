var D = require('drizzlejs');

exports.bindings = {
    state: true,
    exam: false,
    types: false,
    answer: false
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return D.assign({}, {
        exam: this.bindings.exam.data,
        state: this.bindings.state.data,
        types: this.bindings.types.data,
        answer: this.bindings.answer.data,
    });
};

exports.getEntityModuleName = function() {
    return 'exam/exam/score-detail';
};

exports.dataForEntityModule = function(data) {
    this.module.dispatch('clearModels');
    return {
        data: data
    };
};
