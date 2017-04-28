var types = require('./app/exam/exam-question-types');

exports.bindings = {
    sub: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return this.renderOptions.data;
};

exports.getEntityModuleName = function(id, question) {
    var type = question ? question.type : this.renderOptions.type;
    return types.get(type, 1);
};

exports.dataForEntityModule = function(question) {
    var type = question ? question.type : this.renderOptions.type;
    return {
        data: question,
        multiple: Number(type) === 2,
        editMode: this.renderOptions.editMode || 1
    };
};

exports.buttons = [{
    text: '确定',
    fn: function() {
        var mod = this.getEntities()[0],
            question = mod.getValue(),
            sub = this.bindings.sub.data,
            isExist = false,
            i = 0;

        if (!mod.isValidate() || !question) return false;
        for (i; i < sub.questions.length; i++) {
            if (sub.questions[i].id === question.id) {
                question.type = this.renderOptions.type || this.renderOptions.data.type;
                sub.questions[i] = question;
                isExist = true;
            }
        }
        if (!isExist) {
            question.id = 'q-' + (sub.questions.length + 1);
            question.type = this.renderOptions.type || this.renderOptions.data.type;
            sub.questions.push(question);
        }
        return this.module.dispatch('refreshSub');
    }
}];
