var types = require('./app/train/programme/exam/exam-question-types');

exports.title = '试题预览';

exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntity = function() {
    return this.bindings.state.data;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 2);
};

exports.dataForEntityModule = function(question) {
    return {
        data: question,
        multiple: question.type === 2,
        previewMode: 1
    };
};
