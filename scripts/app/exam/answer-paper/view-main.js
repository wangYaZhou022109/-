var types = require('./app/exam/types'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    getCollectCorrect;

exports.bindings = {
    state: true,
    exam: true,
    questions: true,
    answer: true,
    questionTypes: true,
    marks: false
};

exports.type = 'dynamic';

exports.components = [{
    id: 'paper-view-type',
    name: 'selectize'
}];

exports.events = {
    'change paper-view-type': 'changePaperViewType'
};

exports.handlers = {
    changePaperViewType: function() {
        return this.module.dispatch('changePaperViewType', { type: this.$('paper-view-type').value });
    }
};

exports.dataForTemplate = {
    paperViewTypes: function() {
        var paperViewTypes = maps.get('paper-view-type'),
            data = this.bindings.state.data;
        if (data.isOnePageOneQuestion) {
            paperViewTypes[0].selected = true;
        } else {
            paperViewTypes[1].selected = true;
        }
        return paperViewTypes;
    },
    questions: function() {
        return this.bindings.questions.data;
    }
};

exports.getEntity = function(id) {
    var questionId = id,
        question,
        isCollectCorrect = false,
        marks = this.bindings.marks,
        questionTypes = this.bindings.questionTypes;
    if (marks.isCollectDynamicView(questionId)) {
        questionId = questionId.replace('collect-correct-', '');
        isCollectCorrect = true;
    }

    question = this.bindings.exam.getQuestionById(questionId);
    D.assign(question, {
        questionAttrs: question.questionAttrCopys,
        isCollectCorrect: isCollectCorrect,
        index: questionTypes.getQuestionIndexInType(questionId)
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    if (this.bindings.marks.isCollectDynamicView(id)) {
        return 'exam/answer-paper/waiting-check-correct';
    }
    return types.get(question.type, 3);
};

exports.dataForEntityModule = function(question) {
    var me = this;
    if (question.isCollectCorrect) {
        return getCollectCorrect.call(this, question);
    }
    return {
        data: question,
        multiple: question.type === 2,
        answer: this.bindings.answer.getAnswer(question.id),
        callback: function(data) {
            me.bindings.answer.saveAnswer(data);
            me.bindings.state.calculate();
            return me.module.dispatch('reload');
        },
        mode: undefined
    };
};

getCollectCorrect = function(question) {
    var me = this;
    return {
        questionId: question.id,
        correct: this.bindings.marks.getCurrentCorrect(question.id) || {},
        callback: {
            waitingCheck: function(data) {
                return me.module.dispatch('waitingCheck', data);
            },
            correct: function(data) {
                return me.module.dispatch('correct', data);
            }
        }
    };
};
