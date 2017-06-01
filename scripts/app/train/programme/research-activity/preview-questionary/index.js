var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.large = true;

exports.title = '问卷预览';

exports.items = {
    side: 'side',
    main: 'main',
    // head: 'head',
    description: ''
};

exports.store = {
    models: {
        research: { url: '../exam/research-activity' },
        questions: {
            mixin: {
                init: function(dimensions) {
                    var me = this;
                    this.data = [];
                    _.forEach(dimensions, function(d) {
                        _.forEach(d.questions, function(q) {
                            me.data.push(q);
                        });
                    });
                },
                getQuestionById: function(id) {
                    return _.find(this.data, ['id', id]);
                }
            }
        },
        dimensions: {
            mixin: {
                init: function(research) {
                    this.data = _.map(research.dimensions, function(d, dindex) {
                        var qs = d.questions || [];
                        return D.assign(d, {
                            questions: _.map(qs, function(q, i) {
                                return D.assign(q, {
                                    index: i + 1,
                                    dimensionIndex: dindex + 1,
                                    statuss: dindex === 0 && i === 0 ? 'current' : 'init'
                                });
                            }),
                            questionSize: qs.length
                        });
                    });
                },
                getFirstDimension: function() {
                    return this.data[0];
                },
                getDimensionById: function(id) {
                    return _.find(this.data, ['id', id]);
                },
                selectQuestion: function(questionId) {
                    var index = this.data.findIndex(function(d) {
                        return _.some(d.questions, function(q) {
                            return q.statuss === 'current';
                        });
                    });

                    D.assign(_.find(this.data[index].questions, ['statuss', 'current']), {
                        statuss: 'init'
                    });

                    index = this.data.findIndex(function(d) {
                        if (_.find(d.questions, ['id', questionId])) {
                            return true;
                        }
                        return false;
                    });

                    D.assign(_.find(this.data[index].questions, ['id', questionId]), {
                        statuss: 'current'
                    });
                }
            }
        },
        state: {
            mixin: {
                init: function() {
                    var dimensions = this.module.store.models.dimensions,
                        currentDimension = dimensions.getFirstDimension();
                    if (currentDimension) {
                        this.data = {
                            currentDimension: currentDimension,
                            currentQuestion: currentDimension.questions[0]
                        };
                    } else {
                        this.data = {};
                    }
                },
                selectQuestion: function(question) {
                    var dimensions = this.module.store.models.dimensions;
                    D.assign(this.data, {
                        currentQuestion: question,
                        currentDimension: dimensions.getDimensionById(question.dimensionId)
                    });
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var me = this;
            if (payload.researchId) {
                this.models.research.set({
                    id: payload.researchId
                });
                return this.get(this.models.research).then(function() {
                    me.models.dimensions.init(me.models.research.data);
                    me.models.questions.init(me.models.dimensions.data);
                    me.models.state.init();
                });
            }
            if (payload.research) {
                this.models.research.set(payload.research || {});
                this.models.dimensions.init(payload.research);
                this.models.questions.init(this.models.dimensions.data);
                this.models.state.init();
            }
            return true;
        },
        selectQuestion: function(payload) {
            this.models.state.selectQuestion(this.models.questions.getQuestionById(payload.id));
            this.models.dimensions.selectQuestion(payload.id);
            this.models.dimensions.changed();
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
