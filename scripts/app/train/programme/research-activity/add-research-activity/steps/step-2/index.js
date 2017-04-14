var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    main: 'main',
    side: 'side',
    'train/programme/research-activity/add-dimension': { isModule: true },
    'train/programme/research-activity/question/add-question': { isModule: true },
    'train/programme/research-activity/preview-questionary': { isModule: true },
    'train/programme/research-activity/import-data': { isModule: true }
};

exports.store = {
    models: {
        research: {},
        question: { url: '../exam/dimension/question' },
        dimension: { url: '../exam/dimension' },
        dimensionDel: { url: '../exam/dimension/question-del' },
        dimensions: {
            mixin: {
                init: function() {
                    this.data = _.orderBy(this.data, ['order'], ['asc']);
                    _.forEach(this.data, function(d) {
                        D.assign(d, {
                            questions: _.orderBy(d.questions, ['order'], ['asc'])
                        });
                    });
                },
                addDimension: function(data) {
                    this.data.push(data);
                },
                editDimension: function(data) {
                    var index = this.data.findIndex(function(d) {
                        return d.id === data.id;
                    });
                    this.data[index] = data;
                },
                addQuestion: function(question) {
                    var dimension = _.find(this.data, ['id', question.dimensionId]),
                        index = this.data.findIndex(function(d) {
                            return d.id === question.dimensionId;
                        }),
                        questions = dimension.questions || [];
                    questions.push(question);
                    this.data[index].questions = questions;
                },
                sortingDimension: function(data) {
                    var index = this.data.findIndex(function(d) {
                            return d.id === data.id;
                        }),
                        offset = data.offset,
                        target;

                    if (offset < 0 && index !== 0) {
                        target = this.data[index];
                        this.data[index] = this.data[index - 1];
                        this.data[index - 1] = target;

                        target = this.data[index - 1].order;
                        this.data[index - 1].order = this.data[index].order;
                        this.data[index].order = target;
                    }

                    if (offset > 0 && index !== this.data.length - 1) {
                        target = this.data[index];
                        this.data[index] = this.data[index + 1];
                        this.data[index + 1] = target;

                        target = this.data[index + 1].order;
                        this.data[index + 1].order = this.data[index].order;
                        this.data[index].order = target;
                    }
                },
                deleteDimension: function(id) {
                    this.data = _.reject(this.data, ['id', id]);
                },
                editQuestion: function(question) {
                    var index = this.data.findIndex(function(d) {
                            return d.id === question.dimensionId;
                        }),
                        questions = this.data[index].questions,
                        questionIndex = questions.findIndex(function(q) {
                            return q.id === question.id;
                        });
                    questions[questionIndex] = question;
                    this.data[index].questions = questions;
                },
                deleteQuestion: function(question) {
                    var index = this.data.findIndex(function(d) {
                        return d.id === question.dimensionId;
                    });
                    this.data[index].questions = _.reject(this.data[index].questions, ['id', question.id]);
                },
                sortingQuestion: function(payload) {
                    var question = _.find(this.module.store.models.questions.data, ['id', payload.id]),
                        index = this.data.findIndex(function(d) {
                            return d.id === question.dimensionId;
                        }),
                        questions = this.data[index].questions,
                        questionIndex = questions.findIndex(function(q) {
                            return q.id === payload.id;
                        }),
                        offset = payload.offset,
                        target;

                    if (offset < 0 && questionIndex !== 0) {
                        target = questions[questionIndex];
                        questions[questionIndex] = questions[questionIndex - 1];
                        questions[questionIndex - 1] = target;

                        target = questions[questionIndex - 1].order;
                        questions[questionIndex - 1].order = questions[questionIndex].order;
                        questions[questionIndex].order = target;
                    }

                    if (offset > 0 && questionIndex !== questions.length - 1) {
                        target = questions[questionIndex];
                        questions[questionIndex] = questions[questionIndex + 1];
                        questions[questionIndex + 1] = target;

                        target = questions[questionIndex].order;
                        questions[questionIndex].order = questions[questionIndex + 1].order;
                        questions[questionIndex + 1].order = target;
                    }
                    this.data[index].questions = questions;
                }
            }
        },
        questions: {
            mixin: {
                init: function(dimensions) {
                    var me = this;
                    this.data = [];
                    _.forEach(dimensions, function(d) {
                        if (d.questions) {
                            _.forEach(d.questions, function(q) {
                                me.data.push(q);
                            });
                        }
                    });
                },
                addQuestion: function(q) {
                    this.data.push(q);
                },
                getQuestionById: function(id) {
                    return _.find(this.data, ['id', id]);
                },
                editQuestion: function(question) {
                    var index = this.data.findIndex(function(q) {
                        return q.id === question.id;
                    });
                    this.data[index] = question;
                },
                deleteQuestion: function(question) {
                    this.data = _.reject(this.data, ['id', question.id]);
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.research.set(payload.research);
            this.models.dimensions.set(payload.research.dimensions || []);
            this.models.dimensions.init();
            this.models.questions.init(payload.research.dimensions);
        },
        addDimension: function(payload) {
            this.models.dimensions.addDimension(payload);
            this.models.dimensions.changed();
        },
        editDimension: function(payload) {
            this.models.dimensions.editDimension(payload);
            this.models.dimensions.changed();
        },
        addQuestion: function(question) {
            this.models.dimensions.addQuestion(question);
            this.models.questions.addQuestion(question);
            this.models.dimensions.changed();
        },
        editQuestion: function(question) {
            this.models.dimensions.editQuestion(question);
            this.models.questions.editQuestion(question);
            this.models.dimensions.changed();
        },
        deleteQuestion: function(payload) {
            var question = _.find(this.models.questions.data, ['id', payload.id]),
                me = this;
            this.models.dimensionDel.set({
                questionId: payload.id,
                dimensionId: question.dimensionId
            });
            return this.post(this.models.dimensionDel).then(function() {
                me.app.message.success('操作成功！');
                me.models.dimensions.deleteQuestion(question);
                me.models.questions.deleteQuestion(question);
                me.models.dimensions.changed();
            });
        },
        sortingDimension: function(payload) {
            this.models.dimensions.sortingDimension(payload);
            this.models.dimensions.changed();
        },
        deleteDimension: function(payload) {
            var me = this;
            this.models.dimension.set(payload);
            return this.del(this.models.dimension).then(function() {
                me.app.message.success('操作成功！');
                me.models.dimensions.deleteDimension(payload.id);
                me.models.dimensions.changed();
            });
        },
        sortingQuestion: function(payload) {
            this.models.dimensions.sortingQuestion(payload);
            this.models.dimensions.changed();
        },
        insertDimensions: function(data) {
            var me = this;
            _.forEach(data, function(d) {
                me.models.dimensions.data.push(d);
            });
            this.models.questions.init(this.models.dimensions.data);
            me.models.dimensions.changed();
        },
        getDimension: function(payload) {
            var dimension = this.models.dimension,
                dimensions = this.models.dimensions;
            if (!payload.id && !_.find(dimensions.data, ['name', null])) {
                dimension.set({ order: dimensions.data.length + 1 });
                return this.post(this.models.dimension).then(function() {
                    dimensions.data.push(dimension.data);
                });
            }
            return true;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    getData: function() {
        return {
            dimensions: this.store.models.dimensions.data
        };
    },
    isValidator: function() {
        return this.store.models.dimensions.data.length > 0;
    }
};
