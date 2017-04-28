var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    map = {
        1: 1,
        2: 2,
        3: 3,
        4: 6,
        5: 7,
        6: 8,
        7: 5,
        8: 4
    };

exports.large = true;
exports.title = '试卷预览';

exports.items = {
    side: 'side',
    main: 'main'
};

exports.store = {
    models: {
        paper: {
            url: '../exam/paper-class',
            mixin: {
                getQuestionById: function(id) {
                    var paperClassQuestions = this.data.paperClassQuestions;
                    return _.find(paperClassQuestions, ['id', id]).question;
                }
            }
        },
        state: {
            mixin: {
                getCurrentState: function(questionTypes) {
                    var data = {
                            questionType: '',
                            questionIndex: 0,
                            questionTotalInType: 0,
                            currentQuestionScore: 0
                        },
                        t = _.find(questionTypes, ['isCurrent', true]),
                        q;
                    data.questionType = t.data.name;
                    data.questionTotalInType = t.data.data.length;
                    q = _.find(t.data.data, ['isCurrent', true]);
                    if (!q) {
                        data.questionIndex = 1;
                        data.currentQuestionScore = t.data.data[0].score / 100;
                    } else {
                        data.questionIndex = q.i;
                        data.currentQuestionScore = q.score / 100;
                        data.questionId = q.id;
                    }
                    D.assign(this.data, data);
                    return true;
                },
                setFirstQuestionRemote: function(questionTypes) {
                    this.data.questionId = questionTypes[0].data.data[0].id;
                }
            }
        },
        exam: {},
        questionTypes: {
            mixin: {
                createQuestionTypes: function(paper, sort) {
                    var result = [],
                        obj = {},
                        questions = [],
                        qq,
                        paperClassQuestions,
                        type,
                        n = 0,
                        types = maps.get('question-types');
                    if (paper.paperClassQuestions && paper.paperClassQuestions.length > 0) {
                        paperClassQuestions = paper.paperClassQuestions;
                        _.forEach(paperClassQuestions, function(q) {
                            type = map[q.question.type];
                            if (!obj[type]) {
                                obj[type] = { size: 0, totalScore: 0, name: '', data: [] };
                            }
                            obj[type].size++;
                            obj[type].totalScore += q.score / 100;
                            obj[type].name = _.find(types, ['key', q.question.type.toString()]).value;
                            qq = {
                                id: q.id,
                                questionId: q.question.id,
                                i: obj[type].data.length + 1,
                                score: q.score,
                                isCurrent: false
                            };
                            obj[type].data.push(qq);
                            questions.push(qq);
                        });
                        _.forEach(obj, function(v, k) {
                            result.push({ data: obj[k], isCurrent: false, k: n });
                        });
                    }
                    this.store.models.questions.set(questions);
                    this.data = this.changeSort(result, sort);
                },
                setFirstQuestionRemote: function() {
                    var questionTypes = this.data;
                    questionTypes[0].isCurrent = true;
                    questionTypes[0].data.data[0].isCurrent = true;
                },
                move: function(index) {
                    var questionTypes = this.data,
                        state = this.store.models.state,
                        questionType = _.find(questionTypes, ['isCurrent', true]),
                        typeIndex = questionTypes.findIndex(function(qt) {
                            return qt.isCurrent === true;
                        }),
                        questions, q, z;
                    if (questionType) {
                        questions = questionType.data.data;
                        q = _.find(questions, ['isCurrent', true]);
                        z = (q.i - 1) + index;
                        if (questions[z]) {
                            questions[z].isCurrent = true;
                            state.data.questionId = questions[z].id;
                            questions[q.i - 1].isCurrent = false;
                        } else if (index > 0 && questionTypes[typeIndex + 1]) {
                            if (questionTypes[typeIndex + 1]) {
                                questionTypes[typeIndex].isCurrent = false;
                                questionTypes[typeIndex + 1].isCurrent = true;
                                questionType = questionTypes[typeIndex + 1];
                                questions = questionType.data.data;
                                questions.forEach(function(question) {
                                    var qq = question;
                                    qq.isCurrent = false;
                                });
                                questions[0].isCurrent = true;
                            } else {
                                this.module.store.models.state.data.disableNext = true;
                            }
                        } else if (index < 0 && questionTypes[typeIndex - 1]) {
                            if (questionTypes[typeIndex - 1]) {
                                questionTypes[typeIndex].isCurrent = false;
                                questionTypes[typeIndex - 1].isCurrent = true;
                                questionType = questionTypes[typeIndex - 1];
                                questions = questionType.data.data;
                                questions.forEach(function(question) {
                                    var qq = question;
                                    qq.isCurrent = false;
                                });
                                questions[questions.length - 1].isCurrent = true;
                            } else {
                                this.module.store.models.state.data.disablePrev = true;
                            }
                        }
                    }
                    return this.store.models.state.getCurrentState(questionTypes);
                },
                click: function(payload) {
                    var questionTypes = this.data,
                        typeIndex = payload.typeIndex,
                        questionId = payload.questionId,
                        questions, q;
                    if (typeIndex >= 0) {
                        _.forEach(questionTypes, function(t) {
                            var tt = t;
                            tt.isCurrent = false;
                            _.forEach(tt.data.data, function(qqq) {
                                var qqqq = qqq;
                                qqqq.isCurrent = false;
                            });
                        });
                        questionTypes[typeIndex].isCurrent = true;
                    }
                    questions = _.find(questionTypes, ['isCurrent', true]).data.data;
                    if (questionId) {
                        q = _.find(questions, ['id', questionId]);
                        if (q) {
                            _.forEach(questions, function(qq) {
                                var question = qq;
                                question.isCurrent = false;
                            });
                            q.isCurrent = true;
                        }
                    } else {
                        questions[0].isCurrent = true;
                    }
                },
                changeSort: function(questionTypes, sort) {
                    var s = sort || 1,
                        result,
                        changeQuestionSort = function() {
                            return _.map(questionTypes, function(qt) {
                                var questionType = qt,
                                    data = questionType.data.data;
                                questionType.data.data = _.map(data.sort(function() {
                                    return Math.random() - 0.5;
                                }), function(q, i) {
                                    return D.assign(q, { i: i + 1 });
                                });
                                return questionType;
                            });
                        },
                        changeQuestionAttrsSort = function() {
                            var paperClassQuestions = this.store.models.paper.data.paperClassQuestions;
                            _.forEach(paperClassQuestions, function(q) {
                                var question = q.question;
                                if (question.type === 1 || question.type === 2 || question.type === 8) {
                                    D.assign(question, {
                                        questionAttrs: question.questionAttrs.sort(function() {
                                            return Math.random() - 0.5;
                                        })
                                    });
                                }
                            });
                        };
                    switch (s) {
                    case 1:
                        result = questionTypes;
                        break;
                    case 2:
                        result = changeQuestionSort();
                        break;
                    case 3:
                        changeQuestionAttrsSort.call(this);
                        result = questionTypes;
                        break;
                    case 4:
                        changeQuestionAttrsSort.call(this);
                        result = changeQuestionSort();
                        break;
                    default:
                        break;
                    }
                    return result;
                }
            }
        },
        questions: {},
        side: { data: {} },
        answer: {
            data: { answers: [] },
            mixin: {
                save: function(data) {
                    var temp = _.reject(this.data.answers, ['key', data.key]);
                    temp.push(data);
                    this.data.answers = temp;
                    this.store.models.modify.save(data);
                },
                getAnswer: function(id) {
                    return _.find(this.data.answers, ['key', id]);
                }
            }
        },
        modify: {
            data: { answers: [] },
            mixin: {
                save: function(data) {
                    var temp = _.reject(this.data.answers, ['key', data.key]);
                    temp.push(data);
                    this.data.answers = temp;
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var exam = payload.exam || {},
                me = this,
                data = this.models.state.data,
                questionTypes = this.models.questionTypes,
                paperSortRule = payload.paperSortRule || 1;

            _.forEach(this.models, function(m) {
                m.clear();
            });

            this.models.exam.set(exam);
            this.models.paper.set({ id: payload.paperId });
            D.assign(data, {
                name: exam.name,
                isOnePageOneQuestion: true
            });
            return this.get(this.models.paper).then(function() {
                var paper = me.models.paper.data;
                if (!data.name) {
                    data.name = paper.name;
                }
                D.assign(paper, {
                    totalScore: paper.totalScore / 100
                });
                questionTypes.createQuestionTypes(me.models.paper.data, paperSortRule);
                questionTypes.setFirstQuestionRemote();
                me.models.state.getCurrentState(questionTypes.data);
                me.models.state.setFirstQuestionRemote(questionTypes.data);
            });
        },
        reload: function() {
            this.models.state.changed();
        },
        changeState: function(payload) {
            var data = this.models.state.data,
                side = this.models.side;
            D.assign(data, payload);
            D.assign(side.data, payload);
            this.models.questionTypes.click(side.data);
            this.models.state.getCurrentState(this.models.questionTypes.data);
            this.models.state.changed();
        },
        move: function(payload) {
            this.models.questionTypes.move(payload);
            this.models.questionTypes.changed();
            this.models.state.changed();
        },
        changePaperViewType: function(payload) {
            this.models.state.data.isOnePageOneQuestion = Number(payload.type) === 0;
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
