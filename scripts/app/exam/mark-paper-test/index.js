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

exports.title = '试卷评卷';

exports.items = {
    side: 'side',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
        paper: {
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
                    if (t) {
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
                    }
                    return false;
                },
                setFirstQuestionRemote: function(questionTypes) {
                    if (questionTypes.length > 0) this.data.questionId = questionTypes[0].data.data[0].id;
                }
            }
        },
        exam: {
            url: '../exam/exam/exam-mark-paper',
            mixin: {
                getQuestionById: function(id) {
                    var questions = this.data.paper.questions;
                    return _.find(questions, ['id', id]);
                }
            }
        },
        questionTypes: {
            mixin: {
                createQuestionTypes: function(paper) {
                    var result = [],
                        obj = {},
                        questions = [],
                        qq,
                        n = 0,
                        types = maps.get('question-types');
                    if (paper.questions && paper.questions.length > 0) {
                        _.forEach(paper.questions, function(q) {
                            var type = map[q.type];
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
                            result.push({ data: obj[k], isCurrent: false, k: n });
                        });
                    }

                    _.forEach(result, function(r) {
                        _.forEach(r.data.data, function(q) {
                            questions.push(q);
                        });
                    });
                    this.store.models.questions.set(questions);
                    this.data = result;
                },
                setFirstQuestionRemote: function() {
                    var questionTypes = this.data;
                    if (questionTypes.length > 0) {
                        questionTypes[0].isCurrent = true;
                        questionTypes[0].data.data[0].isCurrent = true;
                    }
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
                }
            }
        },
        questions: {},
        side: { data: {} },
        goal: {
            data: { goals: [] },
            mixin: {
                save: function(data) {
                    var temp = _.reject(this.data.goals, ['key', data.key]);
                    temp.push(data);
                    this.data.goals = temp;
                },
                getGoal: function(id) {
                    return _.find(this.data.goals, ['key', id]);
                },
                init: function() {
                    var questions = this.module.store.models.exam.data.paper.questions,
                        me = this;
                    _.forEach(questions, function(q) {
                        if (q.type === 6) {
                            me.data.goals.push({
                                key: q.id,
                                type: 6,
                                value: _.map(_.filter(q.subs, function(s) {
                                    return s.type === 5;
                                }), function(ss) {
                                    if (!ss.answerRecord) return { key: ss.id, value: 0, type: ss.type };
                                    return { key: ss.id, value: '', type: ss.type, isRight: 0 };
                                })
                            });
                        }
                        if (!q.answerRecord) {
                            me.data.goals.push({ key: q.id, value: 0, type: q.type, isRight: 0 });
                        }
                    });
                },
                checkNoMark: function() {
                    var questions = this.module.store.models.exam.data.paper.questions,
                        n = 0,
                        q,
                        goal,
                        check = true;
                    for (n; n < questions.length; n++) {
                        q = questions[n];
                        goal = _.find(this.data.goals, ['key', q.id]);
                        if (q.type === 6) {
                            check = goal && _.every(goal.value, function(v) {
                                return v.value >= 0;
                            });
                            if (!check) return check;
                        } else {
                            check = goal && goal.value !== '';
                            if (!check) return check;
                        }
                    }
                    return check;
                },
                changeAnswerRecord: function() {
                    var result = [];
                    _.forEach(this.data.goals, function(g) {
                        if (g.type === 6) {
                            _.forEach(g.value, function(v) {
                                result.push({
                                    questionId: v.key,
                                    score: v.value * 100,
                                    questionCopy: { type: v.type }
                                });
                            });
                        } else {
                            result.push({
                                questionId: g.key,
                                score: g.value * 100,
                                questionCopy: { type: g.type }
                            });
                        }
                    });
                    return JSON.stringify(result);
                }
            }
        },
        form: {
            url: '../exam/exam/mark-paper-info'
        }
    },
    callbacks: {
        init: function(payload) {
            var me = this,
                data = this.models.state.data,
                questionTypes = this.models.questionTypes;
            D.assign(payload, {
                examRecordId: '1edca744-ce42-4d4a-af6b-a0644cffd00c'
            });
            this.models.exam.set({ id: payload.examRecordId });
            D.assign(data, {
                isOnePageOneQuestion: true
            });
            return this.get(this.models.exam).then(function() {
                var exam = me.models.exam;
                if (!data.name) data.name = exam.data.name;
                data.member = exam.data.examRecord.member;
                me.models.goal.init();
                questionTypes.createQuestionTypes(exam.data.paper);
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
        save: function() {
            var me = this;

            if (!this.models.goal.checkNoMark()) {
                this.app.message.error('必须对全部题目评分完整');
                return false;
            }

            this.models.form.set({
                examRecordId: this.models.exam.data.examRecord.id,
                examId: this.models.exam.data.id,
                answerRecords: this.models.goal.changeAnswerRecord()
            });

            return this.post(this.models.form).then(function() {
                var callback = me.module.renderOptions.callback;
                me.app.message.success('操作成功');
                if (callback) callback();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: '提交评卷',
    fn: function() {
        return this.dispatch('save');
    }
}];
