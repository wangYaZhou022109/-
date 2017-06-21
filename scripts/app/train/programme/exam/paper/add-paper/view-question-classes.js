var types = require('./app/train/programme/exam/exam-question-types'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    $ = require('jquery'),
    validator = require('./app/ext/views/form/validators'),
    markers = require('./app/ext/views/form/markers'),
    checkScore;

exports.type = 'dynamic';

exports.bindings = {
    paper: true,
    summary: false
};

exports.getEntity = function(id) {
    var question = this.module.store.models.paper.getQuestionClass(id).question,
        target = D.assign({}, question),
        subs = _.map(target.subs, function(sub) {
            var s = D.assign({}, sub);
            return D.assign(s, { score: s.score / 100 });
        });
    question = D.assign(target, {
        score: question.score / 100,
        subs: subs,
        questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc'])
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 2);
};

exports.dataForEntityModule = function(question) {
    var me = this;
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2,
        previewMode: Number(question.type) === 6 ? 3 : 2,
        callback: function(data) {
            return me.module.dispatch('updateQuestion', data);
        }
    };
};
exports.mixin = {
    validate: function() {
        var summary = this.bindings.summary.data,
            scores = $(this.$$('[name = "score"]')),
            editScores = $(this.$$('[name = "editScore"]')),
            flag, flagEdit;

        flag = _.every(scores, function(s) {
            return checkScore.call(this, s);
        });
        if (!flag) return false;

        if (editScores) {
            flagEdit = _.every(editScores, function(s) {
                return checkScore.call(this, s);
            });
            if (!flagEdit) return false;
        }

        if (summary.total.score > 1000) {
            this.app.message.error('试卷总分必须在0~1000分，可以保留一位小数');
            return false;
        }

        return true;
    }
};

exports.dataForTemplate = {
    paperClassQuestions: function(data) {
        if (data.paper) {
            return _.map(data.paper.paperClassQuestions, function(q) {
                var qq = q;
                if (qq.question) {
                    if (Number(qq.question.difficulty) === 1) {
                        qq.question.difficulty = '高';
                    } else if (Number(qq.question.difficulty) === 2) {
                        qq.question.difficulty = '中';
                    } else if (Number(qq.question.difficulty) === 3) {
                        qq.question.difficulty = '低';
                    }
                }
                qq.score = q.score / 100;
                qq.question = D.assign(qq.question, { type: Number(qq.question.type) });
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
            paperQuestionClass = this.bindings.paper.getQuestionClass(id),
            question = D.assign({}, paperQuestionClass.question),
            opt = {
                question: D.assign(question, { score: paperQuestionClass.score }),
                callback: function(data) {
                    return me.module.dispatch('updateQuestion', data);
                },
                interim: !question.questionDepot,
                titleType: 'edit'
            };
        this.app.viewport.popup(this.module.items['exam/question/add-question'], opt);
    },
    removeQuestion: function(id) {
        var me = this;
        me.app.message.confirm('确定删除该试题吗？', function() {
            me.module.dispatch('removeQuestionClass', id);
        });
    },
    updatePaper: function(id) {
        if (checkScore.call(this, this.$('score-' + id))) {
            return this.module.dispatch('setScore', {
                questionId: id,
                score: this.$('score-' + id).value
            });
        }
        return false;
    },
    backToTop: function(e) {
        var container = $(e.target).parents('.dialog-content-main');
        container.animate({ scrollTop: 0 }, 500);
    },
    goToBottom: function(e) {
        var container = $(e.target).parents('.dialog-content-main');
        container.animate({ scrollTop: container[0].scrollHeight }, 500);
    }
};

checkScore = function(e) {
    var el = e,
        value = $(el).val();

    markers.text.valid($(el));
    if (!validator.required.fn(value)) {
        markers.text.invalid($(el), '必填项');
        return false;
    }

    if (!validator.keepDecimal.fn(value, 1)) {
        markers.text.invalid($(el), '只能保留1位小数');
        // $(el).val('');
        return false;
    }

    if (!validator.range.fn(value, 0, 100)) {
        markers.text.invalid($(el), '只能填0分~100分');
        // $(el).val('');
        return false;
    }
    return true;
};
