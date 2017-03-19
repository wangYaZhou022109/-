var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps'),
    qTypes = maps.get('question-types'),
    strings = require('./app/util/strings'),
    constant = {
        ONE_HUNDRED: 100,
        ZERO: 0,
        ONE: 1,
        SINGLE_MODE: 1,
        PC_CLIENT_TYPE: 1,
        READING: 6,
        QUESTION_ANSWER: 5
    },
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    orderMap = {
        1: 1,
        2: 2,
        3: 3,
        4: 6,
        5: 7,
        6: 8,
        7: 5,
        8: 4
    },
    getCurrentStatus;

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
        exam: {
            type: 'localStorage',
            url: '../exam/exam/exam-mark-paper/front',
            mixin: {
                getExam: function() {
                    return this.data;
                }
            }
        },
        state: {
            type: 'localStorage',
            mixin: {
                init: function(exam) {
                    var types = this.module.store.models.types;
                    this.load();
                    if (!this.data) {
                        this.data = {
                            name: exam.name,
                            totalCount: exam.paper.questionNum,
                            totalScore: exam.paper.totalScore / constant.ONE_HUNDRED,
                            noAnswerCount: exam.paper.questionNum,
                            answeredCount: constant.ZERO,
                            // singleMode: exam.paperShowRule === constant.SINGLE_MODE,
                            singleMode: true,
                            currentQuestion: types.getFirstQuestion()
                        };
                        this.save();
                    }
                },
                selectQuestion: function(id) {
                    var types = this.module.store.models.types;
                    D.assign(this.data, { currentQuestion: types.getQuestionById(id) });
                },
                resetCurrentQuestion: function() {
                    var types = this.module.store.models.types;
                    D.assign(this.data, { currentQuestion: types.getCurrentQuestion() });
                },
                calculate: function() {
                    var answer = this.module.store.models.answer,
                        answeredCount = answer.answeredCount();
                    D.assign(this.data, {
                        answeredCount: answeredCount,
                        noAnswerCount: this.data.totalCount - answeredCount
                    });
                }
            }
        },
        types: {
            type: 'localStorage',
            mixin: {
                init: function(questions) {
                    var map = {},
                        j = 0;

                    this.load();
                    if (!this.data && questions) {
                        _.forEach(questions, function(q) {
                            var type = orderMap[q.type];

                            if (!map[type]) {
                                map[type] = {};
                                D.assign(map[type], {
                                    type: type,
                                    name: _.find(qTypes, ['key', q.type.toString()]).value,
                                    totalScore: constant.ZERO,
                                    size: constant.ZERO,
                                    status: itemStatus.INIT,
                                    questions: []
                                });
                            }
                            map[type].size++;
                            map[type].questions.push(D.assign(q, {
                                index: map[type].questions.length + constant.ONE,
                                score: q.score / constant.ONE_HUNDRED,
                                status: itemStatus.INIT
                            }));
                        });

                        this.data = _.map(map, function(o) {
                            if (j === constant.ZERO) {
                                D.assign(o.questions[0], { status: itemStatus.CURRENT });
                            }

                            _.map(o.questions, function(q) {
                                D.assign(q, { totalCount: o.size });
                            });
                            j++;
                            return D.assign(o, {
                                totalScore: _.reduce(_.map(o.questions, 'score'), function(sum, n) {
                                    return sum + n;
                                }),
                                isCurrent: true
                            });
                        });

                        this.save();
                    }
                },
                getQuestionById: function(id) {
                    var question;
                    _.forEach(this.data, function(d) {
                        _.forEach(d.questions, function(q) {
                            if (q.id === id) question = q;
                        });
                    });
                    return D.assign(question, {
                        typeDesc: _.find(qTypes, ['key', question.type.toString()]).value + '题'
                    });
                },
                getFirstQuestion: function() {
                    var question = this.data[0].questions[0];
                    return D.assign(question, {
                        typeDesc: _.find(qTypes, ['key', question.type.toString()]).value + '题'
                    });
                },
                selectType: function(id) {
                    if (!this.module.store.models.state.data.selectQuestion) {
                        this.data[id].isCurrent = !this.data[id].isCurrent;
                    }
                    this.module.store.models.state.data.selectQuestion = false;
                    this.save();
                },
                getType: function(questionId) {
                    return _.find(this.data, function(d) {
                        return _.some(d.questions, function(q) {
                            return q.id === questionId;
                        });
                    });
                },
                selectQuestion: function(id) {
                    var type = this.getType(id),
                        index = type.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        }),
                        me = this;

                    if (index > -1) {
                        type.questions[index].status = getCurrentStatus.call(this, type.questions[index].id);
                    }

                    D.assign(this.getQuestionById(id), {
                        status: itemStatus.CURRENT
                    });

                    //  把其他类型的题目的current 设置为其他状态
                    _.forEach(_.filter(this.data, function(t) {
                        return _.every(t.questions, function(q) {
                            return q.id !== id;
                        });
                    }), function(tt) {
                        var n = tt.questions.findIndex(function(qq) {
                            return qq.status === itemStatus.CURRENT;
                        });
                        if (n !== -1) {
                            D.assign(tt.questions[n], { status: getCurrentStatus.call(me, tt.questions[n].id) });
                        }
                    });
                    this.module.store.models.state.data.selectQuestion = true;
                    this.save();
                },
                getCurrentQuestion: function() {
                    var question;
                    _.forEach(this.data, function(t) {
                        _.forEach(t.questions, function(q) {
                            if (q.status === itemStatus.CURRENT) {
                                question = q;
                            }
                        });
                    });
                    return question;
                },
                move: function(payload) {
                    var type = this.data[payload.id],
                        index = type.questions.findIndex(function(q) {
                            return q.status === itemStatus.CURRENT;
                        }),
                        question = type.questions[index + payload.offset];
                    if (question) {
                        question.status = itemStatus.CURRENT;
                        type.questions[index].status = getCurrentStatus.call(this, type.questions[index].id);
                    }
                },
                updateStatus: function(questionId, status) {
                    D.assign(this.getQuestionById(questionId), {
                        status: status
                    });
                    this.save();
                }
            }
        },
        grades: {
            type: 'localStorage',
            mixin: {
                init: function(questions) {
                    this.data = _.map(questions, function(q) {
                        if (q.type === constant.READING) {
                            return {
                                key: q.id,
                                value: _.map(_.filter(q.subs, function(s) {
                                    return s.type === constant.QUESTION_ANSWER;
                                }), function(ss) {
                                    return { key: ss.id, value: ss.answerRecord ? '' : 0, type: ss.type, isRight: 0 };
                                }),
                                type: q.type,
                                isRight: constant.ZERO
                            };
                        }
                        return { key: q.id, value: q.answerRecord ? '' : 0, type: q.type, isRight: constant.ZERO };
                    });
                    this.save();
                },
                getGrade: function(id) {
                    return _.find(this.data, ['key', id]);
                },
                saveGrade: function(data) {
                    this.data = _.reject(this.data, ['key', data.key]);
                    this.data.push(data);
                    this.save();
                },
                getAnswerRecord: function() {
                    var result = [];
                    _.forEach(this.data, function(g) {
                        if (g.type === constant.READING) {
                            _.forEach(g.value, function(gg) {
                                if (gg.type === constant.QUESTION_ANSWER) {
                                    result.push({
                                        questionId: gg.key,
                                        score: gg.value * constant.ONE_HUNDRED,
                                        questionCopy: { type: gg.type }
                                    });
                                }
                            });
                        } else {
                            result.push({
                                questionId: g.key,
                                score: g.value * constant.ONE_HUNDRED,
                                questionCopy: { type: g.type }
                            });
                        }
                    });
                    return result;
                },
                check: function(types) {
                    var me = this;
                    return _.every(types, function(t) {
                        var f = _.every(t.questions, function(q) {
                            var grade = _.find(me.data, ['key', q.id]);
                            if (q.type === 6) {
                                return _.every(grade.value, function(v) {
                                    return v.value !== '';
                                });
                            }
                            return grade.value !== '';
                        });
                        return f;
                    });
                }
            }
        },
        form: {
            url: '../exam/exam/mark-paper-info'
        }
    },
    callbacks: {
        init: function(payload) {
            var exam = this.models.exam,
                types = this.models.types,
                state = this.models.state,
                grades = this.models.grades;

            exam.load();
            if (!exam.data || (exam.data && exam.data.examRecord.id !== payload.examRecordId)) {
                exam.clear();
                types.clear();
                state.clear();
                D.assign(exam.params, { examRecordId: payload.examRecordId });
                return this.get(exam).then(function() {
                    exam.save();
                    types.init(exam.data.paper.questions);
                    state.init(exam.data);
                    grades.init(exam.data.paper.questions);
                });
            }
            return '';
        },
        selectType: function(payload) {
            this.models.types.selectType(payload.id);
            this.models.types.changed();
        },
        selectQuestion: function(payload) {
            this.models.state.selectQuestion(payload.id);
            this.models.types.selectQuestion(payload.id);
            this.models.state.changed();
            this.models.types.changed();
        },
        move: function(payload) {
            this.models.types.move(payload);
            this.models.types.changed();
            this.models.state.resetCurrentQuestion();
            this.models.state.changed();
        },
        saveGrade: function(data) {
            this.models.grades.saveGrade(data);
            if (!this.models.state.data.singleMode) {
                this.models.types.updateStatus(data.key, itemStatus.ACTIVE);
                this.models.types.changed();
            }
        },
        submitGrade: function() {
            var exam = this.models.exam.getExam(),
                me = this;

            if (!this.models.grades.check(this.models.types.data)) {
                this.app.message.error(strings.get('exam.mark-paper-check'));
                return false;
            }

            this.models.form.set({
                examRecordId: exam.examRecord.id,
                examId: exam.id,
                answerRecords: JSON.stringify(this.models.grades.getAnswerRecord())
            });
            return this.post(this.models.form).then(function() {
                me.app.message.success(strings.get('operation-success'));
                me.models.state.clear();
                me.models.types.clear();
                me.models.grades.clear();
                window.close();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.afterRender = function() {
};

getCurrentStatus = function(id) {
    var grades = this.store.models.grades.data,
        grade = _.find(grades, ['key', id]),
        reading;
    if (grade.value.length > 0) {
        reading = _.some(grade.value, function(v) {
            return v.value !== 0;
        });
        if (reading) {
            return itemStatus.ACTIVE;
        }
    } else if (grade.value !== '' && grade.value !== 0) {
        return itemStatus.ACTIVE;
    }
    return itemStatus.INIT;
};
