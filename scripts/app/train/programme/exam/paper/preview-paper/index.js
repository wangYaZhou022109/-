var options = require('./app/train/programme/exam/paper/base-paper/index'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    };

var setOptions = {
    items: {
        'exam-notes': ''
    },
    store: {
        models: {
            exam: {},
            paper: {
                url: '../exam/paper-class'
            },
            questions: {
                mixin: {
                    init: function(paper) {
                        this.data = _.map(paper.paperClassQuestions, function(pcq) {
                            return D.assign(pcq.question, {
                                score: pcq.score,
                                sequence: pcq.sequence
                            });
                        });
                    }
                }
            }
        },
        callbacks: {
            init: function(payload) {
                var paper = this.models.paper,
                    state = this.models.state,
                    types = this.models.types,
                    questions = this.models.questions,
                    exam = this.models.exam;

                this.module.dispatch('clearModels');
                if (payload.exam) D.assign(exam.data, payload.exam);

                if (payload.paperId || payload.examId) {
                    D.assign(paper.params, {
                        paperId: payload.paperId,
                        examId: payload.examId
                    });
                    return this.get(this.models.paper).then(function() {
                        questions.init(paper.data);
                        types.init(questions.data);
                        D.assign(exam.data, { paper: paper.data });
                        state.init(exam.data || {});
                    });
                }
                return '';
            }
        }
    },
    beforeRender: function() {
        return this.dispatch('init', this.renderOptions);
    },
    getCurrentStatus: function() {
        return itemStatus.INIT;
    }
};

var items = D.assign({}, options.items);
var models = D.assign({}, options.store.models);
var callbacks = D.assign({}, options.store.callbacks);

var target = D.assign({}, {
    large: true,
    items: D.assign(items, setOptions.items),
    store: {
        models: D.assign(models, setOptions.store.models),
        callbacks: D.assign(callbacks, setOptions.store.callbacks)
    },
    beforeRender: function() {
        return this.dispatch('init', this.renderOptions);
    },
    getCurrentStatus: function() {
        return itemStatus.INIT;
    }
});

module.exports = target;
