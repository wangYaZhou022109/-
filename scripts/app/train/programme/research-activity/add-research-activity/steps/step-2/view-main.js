var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    types = require('./app/train/programme/research-activity/research-question-types'),
    maps = require('./app/util/maps'),
    PREVIEW_MODE = 4;

exports.HIDE_SCORE = true;
exports.OPTION_SCORE_MODE = 0;

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
        this.app.viewport.modal(mod, {
            hideScore: me.options.HIDE_SCORE,
            question: this.bindings.questions.getQuestionById(id),
            callback: function(question) {
                return me.module.dispatch('editQuestion', question);
            }
        });
    },
    deleteQuestion: function(id) {
        var me = this;
        this.app.message.confirm('试题删除之后将无法恢复，是否确定删除该试题', function() {
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
        data: question,
        mode: this.options.OPTION_SCORE_MODE
    };
};
