var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    $ = require('jquery'),
    strings = require('./app/util/strings');

exports.bindings = {
    dimensions: true,
    research: true,
    dimension: true
};

exports.events = {
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
            this.app.message.error(strings.get('exam.dimension.edit-dimension-check-tips'));
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

        return this.module.dispatch('getDimension', { id: id }).then(function() {
            dimension = _.find(dimensions, ['id', id]);
            if (!dimension) {
                dimension = _.find(dimensions, ['name', null]);
            }
            questions = dimension.questions || [];

            this.app.viewport.modal(mod, {
                type: type,
                hideScore: true,
                data: {
                    order: questions.length + 1,
                    dimensionId: dimension.id,
                },
                callback: function(question) {
                    return me.module.dispatch('addQuestion', question);
                },
            });
        });
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
            this.app.message.error(strings.get('exam.dimension.edit-dimension-check-tips'));
            return false;
        }
        message = strings.getWithParams('delete-warn', strings.get('exam.research.dimension'));
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
            research: D.assign(this.bindings.research.data, {
                dimensions: this.bindings.dimensions.data
            })
        });
    },
    importResearch: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/research-activity/import-data'], {
            callback: function(data) {
                return me.module.dispatch('insertDimensions', data);
            }
        });
    }
};

exports.dataForTemplate = {
    dimensions: function(data) {
        return _.map(data.dimensions, function(d, i) {
            return D.assign(d, {
                dimensionIndex: i + 1,
                questions: _.map(d.questions, function(q, n) {
                    return D.assign(q, { questionIndex: n + 1 });
                })
            });
        });
    }
};
