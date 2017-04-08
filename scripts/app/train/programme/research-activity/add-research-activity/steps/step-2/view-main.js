var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    types = require('./app/exam/research-question-types'),
    maps = require('./app/util/maps'),
    strings = require('./app/util/strings'),
    PREVIEW_MODE = 4,
    NO_OPTION_SCORE = 0;

exports.type = 'dynamic';

exports.bindings = {
    dimensions: true,
    research: true,
    questions: true
};

exports.events = {
    'click edit-question-*': 'editQuestion',
    'click delete-question-*': 'deleteQuestion',
    'click up-question-*': 'upQuestion',
    'click down-question-*': 'downQuestion'
};

exports.handlers = {
    editQuestion: function(id) {
        var mod = this.module.items['train/programme/research-activity/question/add-question'],
            me = this;
        this.app.viewport.popup(mod, {
            hideScore: true,
            question: this.bindings.questions.getQuestionById(id),
            callback: function(question) {
                return me.module.dispatch('editQuestion', question);
            }
        });
    },
    deleteQuestion: function(id) {
        var me = this;
        this.app.message.confirm(strings.getWithParams('delete-warn', strings.get('exam.question')), function() {
            return me.module.dispatch('deleteQuestion', { id: id });
        }, function() {
            return false;
        });
    },
    upQuestion: function(id) {
        return this.module.dispatch('sortingQuestion', { id: id, offset: -1 });
    },
    downQuestion: function(id) {
        return this.module.dispatch('sortingQuestion', { id: id, offset: 1 });
    }
};

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber');

        return _.map(data.dimensions, function(d, i) {
            return D.assign(d, {
                dimensionIndex: _.find(chineseNumber, ['key', (i + 1).toString()]).value,
                questions: _.map(d.questions, function(q, n) {
                    return D.assign(q, {
                        questionIndex: n + 1,
                        typeDesc: _.find(questionTypes, ['key', q.type.toString()]).value + '题'
                    });
                })
            });
        });
    }
};

exports.getEntity = function(id) {
    var question = this.bindings.questions.getQuestionById(id);
    question = D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc']),
        score: question.score / 100
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, PREVIEW_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        data: D.assign(question, { mode: NO_OPTION_SCORE })
    };
};
