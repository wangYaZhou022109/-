var options = require('./app/exam/exam/base-paper/index'),
    D = require('drizzlejs'),
    strings = require('./app/util/strings'),
    itemStatus = {
        INIT: 'init',
        CHECK: 'check',
        ACTIVE: 'active',
        CURRENT: 'current'
    },
    constant = {
        ONE_HUNDRED: 100,
        ZERO: 0,
        ONE: 1,
        SINGLE_MODE: 1,
        PC_CLIENT_TYPE: 1,
        READING: 6,
        QUESTION_ANSWER: 5
    },
    _ = require('lodash/collection');

var setOptions = {
    store: {
        models: {
            exam: {
                url: '../exam/exam/exam-mark-paper',
                mixin: {
                    getExam: function() {
                        return this.data;
                    }
                }
            },
            grades: {
                mixin: {
                    init: function(questions) {
                        this.data = _.map(questions, function(q) {
                            if (q.type === constant.READING) {
                                return {
                                    key: q.id,
                                    value: _.map(_.filter(q.subs, function(s) {
                                        return s.type === constant.QUESTION_ANSWER;
                                    }), function(ss) {
                                        return {
                                            key: ss.id,
                                            value: ss.answerRecord ? '' : 0,
                                            type: ss.type,
                                            isRight: 0
                                        };
                                    }),
                                    type: q.type,
                                    isRight: constant.ZERO
                                };
                            }
                            return { key: q.id, value: q.answerRecord ? '' : 0, type: q.type, isRight: constant.ZERO };
                        });
                    },
                    getGrade: function(id) {
                        return _.find(this.data, ['key', id]);
                    },
                    saveGrade: function(data) {
                        this.data = _.reject(this.data, ['key', data.key]);
                        this.data.push(data);
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

                this.module.dispatch('clearModels');

                D.assign(this.models.exam.params, {
                    examRecordId: payload.examRecordId,
                    examId: payload.examId,
                    memberId: payload.memberId
                });

                return this.get(this.models.exam).then(function() {
                    types.init(exam.data.paper.questions);
                    state.init(exam.data);
                    grades.init(exam.data.paper.questions);
                });
            },
            saveGrade: function(data) {
                this.models.grades.saveGrade(data);
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
                    var callback = me.module.renderOptions.callback;
                    me.app.message.success(strings.get('save-success'));
                    me.models.state.clear();
                    me.models.types.clear();
                    me.models.grades.clear();
                    if (callback) callback();
                    me.app.viewport.closeGround();
                });
            }
        }
    }
};

var items = D.assign({}, options.items);
var models = D.assign({}, options.store.models);
var callbacks = D.assign({}, options.store.callbacks);

var target = D.assign({}, {
    large: true,
    items: D.assign(items, {
        'exam-notes': ''
    }),
    store: {
        models: D.assign(models, setOptions.store.models),
        callbacks: D.assign(callbacks, setOptions.store.callbacks)
    },
    beforeRender: function() {
        return this.dispatch('init', this.renderOptions);
    },
    getCurrentStatus: function() {
        return itemStatus.INIT;
    },
    buttons: [{
        text: '提交评卷',
        fn: function() {
            var me = this;
            this.Promise.create(function(resolve) {
                var message = '是否确定提交评卷?';
                me.app.message.confirm(message, function() {
                    me.dispatch('submitGrade').then(function(data) {
                        if (data) {
                            me.app.viewport.closeGround();
                        }
                    });
                    return false;
                }, function() {
                    resolve(false);
                });
            });
            return false;
        }
    }]
});

module.exports = target;
