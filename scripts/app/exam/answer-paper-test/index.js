// map key: {1:单选,2:多选,3:判断,4:问答,5:填空,6:阅读理解,7:连线,8:排序} value:排序
var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    $ = require('jquery'),
    E = require('./app/exam/exam-websocket'),
    map = {
        1: 1,
        2: 2,
        3: 3,
        4: 6,
        5: 7,
        6: 8,
        7: 5,
        8: 4
    },
    cancel,
    timeOutId,
    submitType = {
        Auto: 'Auto',
        Hand: 'Hand'
    },
    connect,
    closeConnect,
    changeToFullScreen;


exports.items = {
    'question-type': 'question-type',
    main: 'main',
    head: 'head',
    tips: '',
    'count-down': 'count-down'
};

exports.store = {
    models: {
        state: {
            type: 'localStorage',
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
                        data.currentQuestionScore = t.data.data[0].score;
                    } else {
                        data.questionIndex = q.i;
                        data.currentQuestionScore = q.score;
                        data.questionId = q.id;
                    }
                    D.assign(this.data, data);
                    return true;
                },
                setFirstQuestionRemote: function(questionTypes) {
                    this.data.questionId = questionTypes[0].data.data[0].id;
                },
                calculate: function() {
                    var answers = this.store.models.answer.data.answers;
                    this.data.answeredNum = _.filter(answers, function(a) {
                        return a.value.length > 0 && a.value[0].value !== '';
                    }).length;
                    this.data.noAnswerNum = this.data.questionNum - this.data.answeredNum;
                },
                init: function(exam, payload) {
                    this.data = D.assign({}, {
                        name: exam.name,
                        isOnePageOneQuestion: exam.paperShowRule === 1,
                        mode: payload.mode || 1,
                        noAnswerNum: exam.paper.questionNum || 0,
                        answeredNum: 0,
                        questionNum: exam.paper.questionNum,
                        totalScore: exam.paper.totalScore / 100,
                        duration: exam.duration,
                        isCollect: false
                    });
                }
            }
        },
        exam: {
            url: '../exam/exam/exam-paper',
            mixin: {
                getQuestionById: function(id) {
                    var questions = this.data.paper.questions;
                    return _.find(questions, ['id', id]);
                }
            }
        },
        questionTypes: {
            mixin: {
                createQuestionTypes: function(paper, sort) {
                    var result = [],
                        obj = {},
                        qq,
                        type,
                        n = 0,
                        types = maps.get('question-types');
                    if (paper.questions && paper.questions.length > 0) {
                        _.forEach(paper.questions, function(q) {
                            type = map[q.type];
                            if (!obj[type]) {
                                obj[type] = { size: 0, totalScore: 0, name: '', data: [] };
                            }
                            obj[type].size++;
                            obj[type].totalScore += q.score;
                            obj[type].name = types[Number(q.type) - 1].value;
                            qq = {
                                id: q.id,
                                i: obj[type].data.length + 1,
                                score: q.score,
                                isCurrent: false
                            };
                            obj[type].data.push(qq);
                        });
                        _.forEach(obj, function(v, k) {
                            result.push({ type: k, data: obj[k], isCurrent: false, k: n });
                        });
                    }
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
                        questions, q, z;
                    if (questionType) {
                        questions = questionType.data.data;
                        q = _.find(questions, ['isCurrent', true]);
                        z = (q.i - 1) + index;
                        if (questions[z]) {
                            questions[z].isCurrent = true;
                            state.data.questionId = questions[z].id;
                            questions[q.i - 1].isCurrent = false;
                        } else {
                            this.app.message.error('已超出该类型题目范围');
                            return false;
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
                            var questions = this.store.models.exam.data.paper.questions;
                            _.forEach(questions, function(q) {
                                var question = q;
                                if (question.type === 1 || question.type === 2 || question.type === 8) {
                                    D.assign(question, {
                                        questionAttrs: question.questionAttrCopys.sort(function() {
                                            return Math.random() - 0.5;
                                        })
                                    });
                                }
                            });
                        },
                        setQuestions = function(r) {
                            var questions = [];
                            _.forEach(r, function(questionType) {
                                _.forEach(questionType.data.data, function(q) {
                                    questions.push(q);
                                });
                            });
                            this.store.models.questions.set(questions);
                        };
                    switch (s) {
                    case 1:
                        result = questionTypes;
                        break;
                    case 2:
                        result = changeQuestionSort();
                        break;
                    case 3:
                        setQuestions.call(this, questionTypes);
                        changeQuestionAttrsSort.call(this);
                        result = questionTypes;
                        break;
                    case 4:
                        setQuestions.call(this, questionTypes);
                        changeQuestionAttrsSort.call(this);
                        result = changeQuestionSort();
                        break;
                    default:
                        break;
                    }
                    setQuestions.call(this, result);
                    return result;
                },
                getQuestionIndexInType: function(id) {
                    var result = this.data,
                        i = 0,
                        j = 0,
                        question,
                        questions,
                        index = 0;
                    for (i; i < this.data.length; i++) {
                        questions = result[i].data.data;
                        question = _.find(questions, ['id', id]);
                        if (question) {
                            for (j; j < questions.length; j++) {
                                if (questions[j].id === id) {
                                    index = j + 1;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    return index;
                }
            }
        },
        questions: {},
        side: { data: {} },
        answer: {
            type: 'localStorage',
            data: { answers: [] },
            mixin: {
                saveAnswer: function(data) {
                    var temp = _.reject(this.data.answers, ['key', data.key]);
                    temp.push(data);
                    this.data.answers = temp;
                    this.store.models.modify.saveAnswer(data);
                },
                getAnswer: function(id) {
                    return _.find(this.data.answers, ['key', id]);
                }
            }
        },
        modify: {
            type: 'localStorage',
            data: { answers: [], api: {} },
            mixin: {
                saveAnswer: function(data) {
                    var temp = _.reject(this.data.answers, ['key', data.key]);
                    temp.push(data);
                    this.data.answers = temp;
                },
                covert: function(data) {
                    this.data.api = {
                        examRecordId: this.module.store.models.exam.data.examRecord.id,
                        submitType: data.submitType,
                        answerRecords: this.changeAnswerRecord()
                    };
                },
                changeAnswerRecord: function() {
                    var results = [];
                    _.forEach(this.data.answers, function(a) {
                        if (a.type && a.type === 6) {
                            _.forEach(a.value, function(v) {
                                results.push(v);
                            });
                        } else {
                            results.push(a);
                        }
                    });
                    return JSON.stringify(_.map(results, function(a) {
                        return {
                            questionId: a.key,
                            answer: _.map(a.value, 'value').join(',')
                        };
                    }));
                }
            }
        },
        form: {
            url: '../exam/exam-record/submitPaper'
        },
        marks: {
            data: {
                collects: [],
                corrects: []
            },
            mixin: {
                getCurrentCorrect: function(id) {
                    return _.find(this.data.corrects, ['questionId', id]);
                },
                isCollect: function(id) {
                    return _.find(this.data.collects, ['questionId', id]);
                },
                isCollectDynamicView: function(id) {
                    return id.indexOf('collect-correct-') > -1;
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var me = this,
                questionTypes = this.models.questionTypes,
                answer = this.models.answer,
                modify = this.models.modify,
                state = this.models.state;

            answer.load();
            modify.load();
            state.load();

            if (!answer.data) answer.data = { answers: [] };
            if (!modify.data) modify.data = { answers: [], api: {} };
            if (!state.data) state.data = {};

            this.models.exam.set({ id: payload.examId });

            return this.get(this.models.exam).then(function() {
                var exam = me.models.exam.data;

                if (!state.data.isOnePageOneQuestion) me.models.state.init(exam, payload);

                questionTypes.createQuestionTypes(exam.paper, exam.paperSortRule);
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
        },
        collect: function(payload) {
            var collects = this.models.marks.data.collects,
                collect = _.find(collects, ['questionId', payload.questionId]),
                temp;
            if (collect) {
                temp = _.reject(collects, ['questionId', payload.questionId]);
                this.models.marks.data.collects = temp;
            } else {
                collects.push(payload);
            }
            this.models.state.changed();
        },
        correct: function(payload) {
            var temp = _.reject(this.models.marks.data.corrects, ['questionId', payload.questionId]);
            temp.push(payload);
            this.models.marks.data.corrects = temp;
            this.models.state.changed();
        },
        submit: function(payload) {
            var modify = this.models.modify,
                me = this,
                t = true;
            this.models.answer.save();
            this.models.modify.save();
            this.models.state.save();
            if (payload.submitType !== submitType.Auto) cancel();
            modify.covert(payload);
            this.models.form.set(modify.data.api);

            if (t) {
                return this.post(this.models.form).then(function() {
                    if (payload.submitType !== submitType.Auto) {
                        me.models.questionTypes.clear();
                        me.models.questions.clear();
                        me.models.answer.clear();
                        me.models.modify.clear();
                        me.models.state.clear();
                        me.app.message.success('交卷成功');
                        closeConnect();
                        window.close();
                    } else {
                        me.models.modify.data = { answers: [], api: {} };
                    }
                });
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    changeToFullScreen();
    return this.dispatch('init', this.renderOptions);
};


exports.afterRender = function() {
    var me = this,
        t = true,
        examId = this.store.models.exam.data.id,
        getRandom = function() {
            var r = Math.random() * 1,
                min = Number(r.toFixed(2)),
                ms = (min + 0) * (1000 * 60);
            return ms;
        },
        random = getRandom(),
        autoSubmit = function() {
            this.app.message.success('临时提交，请注意...');
            return me.dispatch('submit', { submitType: submitType.Auto }).then(function() {
                timeOutId = setTimeout(autoSubmit, random);
            });
        };

    this.app.message.success('随机秒数' + (random / 1000));
    if (t) {
        timeOutId = setTimeout(autoSubmit, random);
        connect(examId, function() {
            return me.dispatch('submit', { submitType: submitType.Hand }).then(function() {
                me.app.viewport.modal(me.items.tips, { message: '你本次考试已被管理员强制交卷' });
                closeConnect();
                window.close();
            });
        });
    }
};

cancel = function() {
    clearTimeout(timeOutId);
    timeOutId = undefined;
};

connect = function(examId, callback) {
    E.connect(examId, { submitPaper: callback });
};

closeConnect = function() {
    E.disconnect();
};

changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};

