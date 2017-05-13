var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    types = require('./app/train/programme/research-activity/research-question-types'),
    maps = require('./app/util/maps'),
    PREVIEW_MODE = 4,
    $ = require('jquery');

exports.HIDE_SCORE = true;
exports.OPTION_SCORE_MODE = 0;

// 调研活动 题目类型：2
exports.SOURCE_TYPE = 3;
exports.HIDE_SCORE = true;

exports.type = 'dynamic';

exports.bindings = {
    dimensions: true,
    research: true,
    questions: true,
    dimension: true
};

exports.events = {
    'click edit-question-*': 'editQuestion',
    'click delete-question-*': 'deleteQuestion',
    'click up-question-*': 'upQuestion',
    'click down-question-*': 'downQuestion',
    'click add-dimension': 'addDimension',
    'click edit-dimension': 'editDimension',
    'click question-*': 'addQuestion',
    'click d-*': 'chooseDimension',
    'click up-*': 'upDimension',
    'click down-*': 'downDimension',
    'click delete-dimension': 'deleteDimension',
    'click preview': 'preview',
    'click import': 'importResearch'
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
    },
    addDimension: function() {
        var mod = this.module.items['train/programme/research-activity/add-dimension'],
            me = this;
        this.app.viewport.modal(mod, {
            titleType: 'add',
            data: {
                researchQuestionaryId: this.module.renderOptions.id,
                order: this.bindings.dimensions.data.length + 1
            },
            callback: function(payload) {
                return me.module.dispatch('addDimension', payload);
            }
        });
    },
    editDimension: function() {
        var mod = this.module.items['train/programme/research-activity/add-dimension'],
            id = $(this.$$('[name="dimension-radio"]:checked')).val(),
            me = this;

        if (!id) {
            this.app.message.error('请选择维度');
            return false;
        }

        this.app.viewport.modal(mod, {
            titleType: 'edit',
            data: {
                id: id,
                researchQuestionaryId: this.module.renderOptions.id
            },
            callback: function(payload) {
                return me.module.dispatch('editDimension', payload);
            }
        });
        return true;
    },
    addQuestion: function(type) {
        var mod = this.module.items['train/programme/research-activity/question/add-question'],
            id = $(this.$$('[name="dimension-radio"]:checked')).val(),
            dimensions = this.bindings.dimensions.data,
            dimension,
            questions,
            me = this;

        if (!id) {
            this.app.message.error('请选择维度');
            return false;
        }
        dimension = _.find(dimensions, ['id', id]);
        questions = dimension.questions || [];

        this.app.viewport.modal(mod, {
            type: type,
            hideScore: me.options.HIDE_SCORE,
            data: {
                sourceType: me.options.SOURCE_TYPE,
                order: questions.length + 1,
                dimensionId: dimension.id,
            },
            callback: function(question) {
                return me.module.dispatch('addQuestion', question);
            },
        });
        return true;
    },
    chooseDimension: function(id) {
        _.forEach(this.bindings.dimensions.data, function(d) {
            var dimension = d;
            if (d.id === id) {
                dimension.checked = true;
            }
        });
    },
    upDimension: function(id) {
        return this.module.dispatch('sortingDimension', { id: id, offset: -1 });
    },
    downDimension: function(id) {
        return this.module.dispatch('sortingDimension', { id: id, offset: 1 });
    },
    deleteDimension: function() {
        var me = this,
            id = $(this.$$('[name="dimension-radio"]:checked')).val(),
            message;

        if (!id) {
            this.app.message.error('请选择维度');
            return false;
        }
        message = '维度删除后将无法恢复，是否确定删除该维度';
        this.app.message.confirm(message, function() {
            return me.module.dispatch('deleteDimension', { id: id });
        }, function() {
            return false;
        });
        return true;
    },
    preview: function() {
        var mod = this.module.items['train/programme/research-activity/preview-questionary'];
        this.app.viewport.modal(mod, {
            hideScore: this.options.HIDE_SCORE,
            research: D.assign(this.bindings.research.data, {
                dimensions: this.bindings.dimensions.data
            })
        });
        // var research = D.assign(this.bindings.research.data, {
        //     dimensions: this.bindings.dimensions.data
        // });
        // var url = '#/train/programme/research-activity/preview-questionary?research=' + research;
        // window.open(url, '_blank');
    },
    importResearch: function() {
        var me = this,
            research = this.bindings.research.data;
        this.app.viewport.modal(this.module.items['train/programme/research-activity/import-data'], {
            type: research.type,
            callback: function(data) {
                return me.module.dispatch('insertDimensions', data);
            }
        });
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
    var question = this.bindings.questions.getQuestionById(id),
        newQuestion = JSON.parse(JSON.stringify(question));
    newQuestion = D.assign({}, newQuestion, {
        questionAttrs: _.orderBy(_.map(newQuestion.questionAttrs, function(qr) {
            if (qr.score) return D.assign(qr, { score: qr.score / 100 });
            return qr;
        }), ['name'], ['asc']),
        score: newQuestion.score / 100
    });
    return newQuestion;
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
