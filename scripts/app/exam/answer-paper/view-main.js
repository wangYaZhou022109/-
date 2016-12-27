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
    'change paper-view-type': 'changePaperViewType',
    'click prev': 'prev',
    'click next': 'next'
};

exports.handlers = {
    changePaperViewType: function() {
        return this.module.dispatch('changePaperViewType', { type: this.$('paper-view-type').value });
    },
    prev: function() {
        return this.module.dispatch('move', -1);
    },
    next: function() {
        return this.module.dispatch('move', 1);
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
        marks = this.bindings.marks;

    if (marks.isCollectDynamicView(questionId)) {
        questionId = questionId.replace('collect-correct-', '');
        isCollectCorrect = true;
    }

    question = this.bindings.exam.getQuestionById(questionId);
    D.assign(question, {
        questionAttrs: question.questionAttrCopys,
        isCollectCorrect: isCollectCorrect
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    if (this.bindings.marks.isCollectDynamicView(id)) {
        return 'exam/paper/answer-paper/collect-correct';
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
        mode: 1
    };
};

getCollectCorrect = function(question) {
    var me = this;
    return {
        questionId: question.id,
        isCollect: this.bindings.marks.isCollect(question.id),
        correct: this.bindings.marks.getCurrentCorrect(question.id) || {},
        callback: {
            collect: function(data) {
                return me.module.dispatch('collect', data);
            },
            correct: function(data) {
                return me.module.dispatch('correct', data);
            }
        }
    };
};
