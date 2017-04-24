var types = require('./app/train/programme/exam/exam-question-types'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    $ = require('jquery');

exports.type = 'dynamic';

exports.bindings = {
    paper: true
};

exports.getEntity = function(id) {
    var question = this.module.store.models.paper.getQuestionClass(id).question;
    question = D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['createTime'], ['asc']),
        score: question.score / 100
    });
    return question;
};
exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 2);
};
exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2,
        previewMode: 2
    };
};
exports.mixin = {
    validate: function() {
        var result = true,
            scores = this.$$('[name = "score"]');
        if (!D.isArray(scores)) {
            scores = [];
            scores.push(this.$$('[name = "score"]'));
        }
        scores.forEach(function(score) {
            var s = $(score).val();
            var reg = /^[+]?(([1-9]\d*)|\d)(\.\d)?$/;
            if (!reg.test(s)) {
                result = false;
            }
            if (s > 1000) {
                result = false;
            }
        });
        if (!result) {
            this.app.message.error('分数必须是大于等于0小于等于1000，且保留一位小数的数字');
        }
        return result;
    }
};

exports.dataForTemplate = {
    paperClassQuestions: function(data) {
        if (data.paper) {
            return _.map(data.paper.paperClassQuestions, function(q) {
                var qq = q;
                if (qq.question) {
                    if (qq.question.difficulty === 1 || qq.question.difficulty === '1') {
                        qq.question.difficulty = '高';
                    } else if (qq.question.difficulty === 2 || qq.question.difficulty === '2') {
                        qq.question.difficulty = '中';
                    } else if (qq.question.difficulty === 3 || qq.question.difficulty === '3') {
                        qq.question.difficulty = '低';
                    }
                }
                qq.score = q.score / 100;
                return qq;
            });
        }
        return [];
    }
};

exports.events = {
    'click move-up-*': 'moveUp',
    'click move-down-*': 'moveDown',
    'click edit-question-*': 'editQuestion',
    'click remove-question-*': 'removeQuestion',
    'change score-*': 'updatePaper',
    'click backToTop': 'backToTop',
    'click goToBottom': 'goToBottom'
};

exports.handlers = {
    moveUp: function(id) {
        this.module.dispatch('moveUp', id);
    },
    moveDown: function(id) {
        this.module.dispatch('moveDown', id);
    },
    editQuestion: function(id) {
        var me = this,
            question = this.bindings.paper.getQuestionClass(id).question,
            opt = {
                question: question,
                callback: function(data) {
                    return me.module.dispatch('updateQuestion', data);
                },
                interim: !question.questionDepot,
                titleType: 'edit'
            };
        this.app.viewport.modal(this.module.items['train/programme/exam/question/add-question'], opt);
    },
    removeQuestion: function(id) {
        var me = this;
        me.app.message.confirm('确定删除该试题吗？', function() {
            me.module.dispatch('removeQuestionClass', id);
        });
    },
    updatePaper: function(id) {
        var score = Number(this.$('score-' + id).value);
        var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        if (reg.test(score)) {
            this.module.dispatch('setScore', { questionId: id, score: score });
        }
    },
    backToTop: function(e) {
        var container = $(e.target).parents('.container');
        container.animate({ scrollTop: 0 }, 500);
    },
    goToBottom: function(e) {
        var container = $(e.target).parents('.container');
        container.animate({ scrollTop: container[0].scrollHeight }, 500);
    }
};
