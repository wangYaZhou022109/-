// map key: {1:单选,2:多选,3:判断,4:问答,5:填空,6:阅读理解,7:连线,8:排序} value:排序
var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    strings = require('./app/util/strings'),
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
    changeToFullScreen,
    // navigateToExamDetail,
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    getCurrentStatus;


exports.items = {
    'question-type': 'question-type',
    main: 'main',
    head: 'head',
    tips: '',
    'count-down': 'count-down'
};

exports.store = {
    models: {
        countDown: {
            type: 'localStorage',
            data: {}
        },
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
                    q = _.find(t.data.data, ['currentStatus', itemStatus.CURRENT]);
                    if (!q) {
                        data.questionIndex = 1;
                        data.currentQuestionScore = t.data.data[0].score;
                    } else {
                        data.questionIndex = q.i;
                        data.currentQuestionScore = q.score;
                        data.questionId = q.id;
                    }
                    D.assign(this.data, data);
                    this.module.store.models.questionTypes.save();
                    this.save();
                    return true;
                },
                setFirstQuestionRemote: function(questionTypes) {
                    this.data.questionId = questionTypes[0].data.data[0].id;
                },
                calculate: function() {
                    var answers = this.store.models.answer.data.answers;
                    this.data.answeredNum = _.filter(answers, function(a) {
                        var readingQuetion = !_.every(a.value, function(sub) {
                                return sub.value.length === 0 || sub.value[0].value === '';
                            }),
                            otherQuestion = a.value[0].value !== '';
                        return Number(a.type) === 6 ? readingQuetion : otherQuestion;
                    }).length;
                    this.data.noAnswerNum = this.data.questionNum - this.data.answeredNum;
                },
                init: function(exam, payload) {
                    this.data = D.assign({}, {
                        name: exam.name,
                        id: exam.id,
                        isOnePageOneQuestion: true,
                        mode: payload.mode || 1,
                        noAnswerNum: exam.paper.questionNum || 0,
                        answeredNum: 0,
                        questionNum: exam.paper.questionNum,
                        totalScore: exam.paper.totalScore / 100,
                        duration: exam.duration
                    });
                }
            }
        },
        exam: {
            url: '../exam/exam/exam-paper',
            type: 'localStorage',
            mixin: {
                getQuestionById: function(id) {
                    var questions = this.data.paper.questions;
                    return _.find(questions, ['id', id]);
                }
            }
        },
        questionTypes: {
            type: 'localStorage',
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
                            obj[type].totalScore += q.score / 100;
                            obj[type].name = types[Number(q.type) - 1].value;
                            qq = {
                                id: q.id,
                                i: obj[type].data.length + 1,
                                score: q.score / 100,
                                isCurrent: false,
                                currentStatus: itemStatus.INIT
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
                    questionTypes[0].data.data[0].currentStatus = itemStatus.CURRENT;
                },
                move: function(index) {
                    var questionTypes = this.data,
                        state = this.store.models.state,
                        questionType = _.find(questionTypes, ['isCurrent', true]),
                        // typeIndex = questionTypes.findIndex(function(qt) {
                        //     return qt.isCurrent === true;
                        // }),
                        questions, q, z;
                    if (questionType) {
                        questions = questionType.data.data;
                        q = _.find(questions, ['currentStatus', itemStatus.CURRENT]);
                        z = (q.i - 1) + index;
                        if (questions[z]) {
                            questions[z].currentStatus = itemStatus.CURRENT;
                            state.data.questionId = questions[z].id;
                            questions[q.i - 1].currentStatus = getCurrentStatus.call(this, questions[q.i - 1]);
                        }
                        // } else if (index > 0 && questionTypes[typeIndex + 1]) {
                        //     if (questionTypes[typeIndex + 1]) {
                        //         questionTypes[typeIndex].isCurrent = false;
                        //         questionTypes[typeIndex + 1].isCurrent = true;
                        //         questionType = questionTypes[typeIndex + 1];
                        //         questions = questionType.data.data;
                        //         questions.forEach(function(question) {
                        //             var qq = question;
                        //             qq.isCurrent = false;
                        //         });
                        //         questions[0].isCurrent = true;
                        //     } else {
                        //         this.module.store.models.state.data.disableNext = true;
                        //     }
                        // } else if (index < 0 && questionTypes[typeIndex - 1]) {
                        //     if (questionTypes[typeIndex - 1]) {
                        //         questionTypes[typeIndex].isCurrent = false;
                        //         questionTypes[typeIndex - 1].isCurrent = true;
                        //         questionType = questionTypes[typeIndex - 1];
                        //         questions = questionType.data.data;
                        //         questions.forEach(function(question) {
                        //             var qq = question;
                        //             qq.isCurrent = false;
                        //         });
                        //         questions[questions.length - 1].isCurrent = true;
                        //     } else {
                        //         this.module.store.models.state.data.disablePrev = true;
                        //     }
                        // }
                    }
                    return this.store.models.state.getCurrentState(questionTypes);
                },
                click: function(payload) {
                    var questionTypes = this.data,
                        typeIndex = payload.typeIndex,
                        questionId = payload.questionId,
                        questions, q,
                        me = this;
                    if (typeIndex >= 0) {
                        _.forEach(questionTypes, function(t) {
                            var tt = t;
                            tt.isCurrent = false;
                            _.forEach(tt.data.data, function(question) {
                                D.assign(question, { isCurrent: false });
                            });
                        });
                        questionTypes[typeIndex].isCurrent = true;
                    }
                    questions = _.find(questionTypes, ['isCurrent', true]).data.data;
                    if (questionId) {
                        q = _.find(questions, ['id', questionId]);
                        if (q) {
                            _.map(questions, function(question) {
                                if (question.currentStatus === itemStatus.CURRENT) {
                                    D.assign(question, { currentStatus: getCurrentStatus.call(me, question) });
                                }
                            });
                            q.isCurrent = true;
                            q.currentStatus = itemStatus.CURRENT;
                        }
                    } else {
                        questions[0].currentStatus = itemStatus.CURRENT;
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
                        questions,
                        index = 0;
                    for (i; i < this.data.length; i++) {
                        questions = result[i].data.data;
                        index = questions.findIndex(function(q) {
                            return q.id === id;
                        });
                        if (index !== -1) return index + 1;
                    }
                    return index + 1;
                },
                waitingCheck: function(questionId) {
                    _.map(this.data, function(d) {
                        _.map(d.data.data, function(q) {
                            if (q.id === questionId) {
                                D.assign(q, { currentStatus: itemStatus.CHECK });
                            }
                        });
                    });
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
                    this.save();
                },
                getAnswer: function(id) {
                    if (this.data) {
                        return _.find(this.data.answers, ['key', id]);
                    }
                    return null;
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
                    this.save();
                },
                covert: function(data) {
                    this.data.api = {
                        examRecordId: this.module.store.models.exam.data.examRecord.id,
                        submitType: data.submitType,
                        answerRecords: this.changeAnswerRecord(),
                        clientType: 1
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
            type: 'localStorage',
            data: {
                corrects: [],
                waitingChecks: []
            },
            mixin: {
                getCurrentCorrect: function(id) {
                    return _.find(this.data.corrects, ['questionId', id]);
                },
                correct: function(data) {
                    var temp = _.reject(this.data.corrects, ['questionId', data.questionId]);
                    temp.push(data);
                    this.data.corrects = temp;
                    this.save();
                },
                isCollectDynamicView: function(id) {
                    return id.indexOf('collect-correct-') > -1;
                },
                waitingCheck: function(id) {
                    var data = this.data.waitingChecks || [];
                    if (_.find(data, ['key', id])) {
                        this.data.waitingChecks = _.reject(data, ['key', id]);
                    } else {
                        data.push({ key: id });
                        this.data.waitingChecks = data;
                    }
                    this.save();
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
                state = this.models.state,
                exam = this.models.exam,
                countDown = this.models.countDown,
                marks = this.models.marks;

            answer.load();
            modify.load();
            state.load();
            countDown.load();
            questionTypes.load();
            exam.load();
            marks.load();

            if (!state.data || (state.data.id && state.data.id !== payload.examId)) {
                this.models.exam.clear();
                this.models.exam.params = { examId: payload.examId };

                return this.get(this.models.exam).then(function() {
                    var examData = me.models.exam.data;
                    me.models.exam.save();

                    state.data = {};
                    answer.data = { answers: [] };
                    modify.data = { answers: [], api: {} };
                    countDown.data = {};
                    marks.data = { corrects: [], waitingChecks: [] };

                    me.models.state.init(examData, payload);

                    questionTypes.createQuestionTypes(examData.paper, examData.paperSortRule);
                    questionTypes.setFirstQuestionRemote();

                    me.models.state.getCurrentState(questionTypes.data);
                    me.models.state.setFirstQuestionRemote(questionTypes.data);
                });
            }
            if (!answer.data) answer.data = { answers: [] };
            if (!modify.data) modify.data = { answers: [], api: {} };
            if (!marks.data) marks.data = { corrects: [], waitingChecks: [] };
            return '';
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
            this.models.questionTypes.changed();
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
        waitingCheck: function(payload) {
            this.models.marks.waitingCheck(payload.questionId);
            this.app.message.success(strings.get('operation-success'));
        },
        correct: function(payload) {
            this.models.marks.correct(payload);
            this.models.state.changed();
        },
        submit: function(payload) {
            var modify = this.models.modify,
                me = this,
                t = true;
                // examId = this.models.exam.data.id;

            this.models.answer.save();
            this.models.modify.save();

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
                        me.models.countDown.clear();
                        me.models.questionTypes.clear();
                        me.models.exam.clear();
                        me.app.viewport.modal(me.module.items.tips, { message: '交卷成功' });
                        setTimeout(function() {
                            closeConnect();
                            me.app.viewport.closeModal();
                            window.close();
                            // navigateToExamDetail(examId);
                        }, 1500);
                    } else {
                        this.app.message.success('答卷已自动保存成功');
                        me.models.modify.data = { answers: [], api: {} };
                    }
                });
            }
            return '';
        },
        delay: function(payload) {
            this.models.countDown.data.delay = payload.delay;
            this.models.countDown.changed();
        }
    }
};

exports.beforeRender = function() {
    changeToFullScreen();
    return this.dispatch('init', this.renderOptions);
};


exports.afterRender = function() {
    var me = this,
        t = false,
        examId = this.store.models.exam.data.id,
        getRandom = function() {
            var r = Math.random() * 1,
                min = Number(r.toFixed(2)),
                ms = (min + 1) * (1000 * 60);
            return ms;
        },
        random = getRandom(),
        autoSubmit = function() {
            return me.dispatch('submit', { submitType: submitType.Auto }).then(function() {
                timeOutId = setTimeout(autoSubmit, random);
            });
        };

    // this.app.message.success('随机秒数' + (random / 1000));
    if (t) {
        autoSubmit();
        timeOutId = setTimeout(autoSubmit, random);
        connect(examId, function() {
            me.app.viewport.modal(me.items.tips, { message: '你本次考试已被管理员强制交卷' });
            return me.dispatch('submit', { submitType: submitType.Hand }).then(function() {
                closeConnect();
            });
        }, function(delay) {
            return me.dispatch('delay', { delay: Number(delay) });
        });
    }
};

cancel = function() {
    clearTimeout(timeOutId);
    timeOutId = undefined;
};

connect = function(examId, submitPaper, timeExpand) {
    E.connect(examId, {
        submitPaper: submitPaper,
        timeExpand: timeExpand
    });
};

closeConnect = function() {
    E.disconnect();
};

changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};

// navigateToExamDetail = function(examId) {
//     var url = 'exam/index/' + examId;
//     this.app.navigate(url, true);
// };

getCurrentStatus = function(question) {
    var data = this.module.store.models.answer.data,
        waitingCheck = this.module.store.models.marks.data.waitingChecks;
    if (_.find(waitingCheck, ['key', question.id])) {
        return itemStatus.CHECK;
    } else if (_.find(data.answers, ['key', question.id])) {
        return itemStatus.ACTIVE;
    }
    return itemStatus.INIT;
};
