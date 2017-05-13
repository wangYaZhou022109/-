var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    $ = require('jquery'),
    D = require('drizzlejs'),
    initTable;
exports.title = function() {
    return this.renderOptions.id ? '编辑试卷' : '新增试卷';
};
exports.items = {
    summary: 'summary',
    'question-classes': 'question-classes',
    'train/programme/exam/question/add-question': {
        isModule: true
    },
    'train/programme/exam/question/select-question': {
        isModule: true
    },
    'train/programme/exam/question/import-data': { isModule: true }
};

exports.store = {
    models: {
        paper: {
            url: '../exam/paper-class',
            data: {
                questionNum: 0,
                totalScore: 0,
                paperClassQuestions: []
            },
            mixin: {
                getQuestionClass: function(questionId) {
                    var me = this;
                    return _.find(me.store.models.paper.data.paperClassQuestions, { questionId: questionId });
                },
                getQuestionIds: function() {
                    var me = this;
                    return _.map(me.store.models.paper.data.paperClassQuestions, function(qc) {
                        return qc.questionId;
                    });
                }
            }
        },
        summary: { data: {} }
    },
    callbacks: {
        init: function() {
            var me = this,
                id = me.module.renderOptions.id;
            if (id) {
                D.assign(me.models.paper.params, {
                    paperId: id
                });
                me.get(me.models.paper).then(function() {
                    me.module.reload();
                });
            } else {
                me.module.reload();
            }
        },
        savePaper: function(payload) {
            var me = this,
                paperClassQuestions = me.models.paper.data.paperClassQuestions;
            _.map(paperClassQuestions, function(e, index) {
                var target = e;
                target.sequence = index;
                delete target.question;
                return target;
            });
            D.assign(me.models.paper.data, payload, {
                paperClassQuestions: JSON.stringify(paperClassQuestions),
                type: me.module.renderOptions.type || 1,
                totalScore: me.models.paper.data.totalScore * 100,
                name: this.module.renderOptions.paperName
            });
            return me.save(me.models.paper);
        },
        submitDataBack: function() {
            var me = this,
                paperClassQuestions = me.models.paper.data.paperClassQuestions;
            D.assign(me.models.paper.data, {
                paperClassQuestions: JSON.parse(paperClassQuestions),
                totalScore: me.models.paper.data.totalScore / 100
            });
        },
        moveDown: function(id) {
            var paperClassQuestions = this.models.paper.data.paperClassQuestions,
                target,
                index;
            index = paperClassQuestions.findIndex(function(e) {
                return e.questionId === id;
            });
            if (index >= paperClassQuestions.length - 1) {
                return;
            }
            target = paperClassQuestions[index];
            paperClassQuestions[index] = paperClassQuestions[index + 1];
            paperClassQuestions[index + 1] = target;
            this.models.paper.changed();
        },
        moveUp: function(id) {
            var paperClassQuestions = this.models.paper.data.paperClassQuestions,
                target,
                index;
            index = paperClassQuestions.findIndex(function(e) {
                return e.questionId === id;
            });
            if (index <= 0) {
                return;
            }
            target = paperClassQuestions[index];
            paperClassQuestions[index] = paperClassQuestions[index - 1];
            paperClassQuestions[index - 1] = target;
            this.models.paper.changed();
        },
        addQuestionClass: function(q) {
            var me = this,
                questionClass = {},
                paperClassQuestions = me.models.paper.data.paperClassQuestions;
            if (_.find(paperClassQuestions, { questionId: q.id })) {
                return;
            }
            questionClass.paperClassId = me.models.paper.id;
            questionClass.questionId = q.id;
            questionClass.score = Number(q.score);
            questionClass.sequence = paperClassQuestions.size;
            questionClass.isFromSelected = q.isFromSelected || 0;
            questionClass.question = q;
            paperClassQuestions.push(questionClass);
            me.models.paper.changed();
            me.module.dispatch('reloadSummary');
        },
        addQuestionClasses: function(questions) {
            var me = this,
                paperClassQuestions = me.models.paper.data.paperClassQuestions;
            _.forEach(questions, function(q) {
                var questionClass = {};
                if (_.find(paperClassQuestions, { questionId: q.id })) {
                    return;
                }
                questionClass.paperClassId = me.models.paper.id;
                questionClass.questionId = q.id;
                questionClass.score = Number(q.score);
                questionClass.sequence = paperClassQuestions.size;
                questionClass.isFromSelected = q.isFromSelected || 0;
                questionClass.question = q;
                paperClassQuestions.push(questionClass);
            });
            // me.models.paper.changed();
            me.module.dispatch('reloadSummary');
        },
        updatePaper: function(map) {
            if (map && map.key) {
                this.models.paper.data[map.key] = map.value;
            }
        },
        updatePaperTotal: function() {
            var me = this,
                summary = me.models.summary.data || {},
                paper = me.models.paper.data;
            if (!summary.total) summary.total = { amount: 0, score: 0 };
            paper.questionNum = summary.total.amount;
            paper.totalScore = summary.total.score;
            me.models.paper.changed();
        },
        setScore: function(params) {
            var me = this,
                questionClass = _.find(me.models.paper.data.paperClassQuestions, { questionId: params.questionId });
            questionClass.score = params.score * 100;
            me.module.dispatch('reloadSummary');
        },
        updateQuestion: function(q) {
            var me = this,
                target,
                paperClassQuestions = me.models.paper.data.paperClassQuestions;
            target = _.find(paperClassQuestions, { questionId: q.id });
            target.question = q;
            target.score = q.score;
            me.models.paper.changed();
        },
        removeQuestionClass: function(questionId) {
            var paperClassQuestions = this.models.paper.data.paperClassQuestions,
                index;
            index = paperClassQuestions.findIndex(function(qc) {
                return qc.questionId === questionId;
            });
            this.models.paper.data.paperClassQuestions.splice(index, 1);
            this.models.paper.changed();
            this.module.dispatch('reloadSummary');
        },
        removeQuestionClasses: function(questions) {
            var paperClassQuestions = this.models.paper.data.paperClassQuestions,
                me = this;
            _.forEach(questions, function(q) {
                var index = paperClassQuestions.findIndex(function(qc) {
                    return qc.questionId === q.id;
                });
                me.models.paper.data.paperClassQuestions.splice(index, 1);
            });
            this.models.paper.changed();
            this.module.dispatch('reloadSummary');
        },
        reloadSummary: function() {
            var me = this,
                summary = me.models.summary.data,
                table = initTable(),
                paperClassQuestions = me.models.paper.data.paperClassQuestions;
            summary.total = { amount: 0, score: 0 };
            _.forEach(paperClassQuestions, function(qc) {
                var question = qc.question;
                if (!table[qc.question.type]) throw new Error('paperClassQuestions type is not define');
                if (!table[qc.question.type].total) table[qc.question.type].total = { amount: 0, score: 0 };
                table[qc.question.type].total.amount ++;
                table[qc.question.type].total.score += Number(qc.score) / 100;
                table[qc.question.type].total.score = Number((table[qc.question.type].total.score).toFixed(1));
                summary.total.amount ++;
                summary.total.score += Number(qc.score) / 100;
                summary.total.score = Number((summary.total.score).toFixed(1));
                question.questionAttrs = _.orderBy(question.questionAttrs, ['name'], ['asc']);
            });
            summary.rows = table;
            summary.rows = _.filter(summary.rows, function(e) {
                if (e.total && e.total.amount && e.total.amount > 0) {
                    return true;
                }
                return false;
            });
            me.models.summary.changed();
            me.module.dispatch('updatePaperTotal');
        }
    }
};
initTable = function() {
    var types = maps.get('question-types'),
        table = {};
    _.forEach(types, function(t) {
        var row = {
            type: Number(t.key),
            typeName: t.value
        };
        table[row.type] = row;
    });
    return table;
};
exports.buttons = [{
    text: '保存',
    fn: function(payload) {
        var me = this,
            paperClassQuestions = me.store.models.paper.data.paperClassQuestions,
            organizationId = $('input[name="organizationId"]').val(),
            callback = this.renderOptions.callback;
        return me.dispatch('updatePaper', { key: 'organizationId', value: organizationId }).then(function() {
            if (paperClassQuestions.length < 1) {
                me.app.message.error('试题不能为空');
                return false;
            } else if (!me.items['question-classes'].validate()) {
                return false;
            } else if (me.store.models.paper.data.totalScore > 1000) {
                me.app.message.error('试卷总分不能超过1000分');
                return false;
            }
            return me.dispatch('savePaper', payload).then(function() {
                var result = me.store.models.paper.data.id || '';
                me.app.message.success('保存成功');
                callback(result);
            }, function() {
                me.dispatch('submitDataBack');
                return false;
            });
        });
    }
}];

exports.mixin = {
    reload: function() {
        return this.dispatch('reloadSummary');
    }
};
exports.beforeRender = function() {
    this.store.models.paper.data = {
        questionNum: 0,
        totalScore: 0,
        paperClassQuestions: []
    };
};

exports.afterRender = function() {
    return this.dispatch('init');
};

