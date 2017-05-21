var options = require('./app/exam/exam/base-paper/index'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
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
    $ = require('jquery'),
    validator = require('./app/ext/views/form/validators'),
    markers = require('./app/ext/views/form/markers'),
    checkScore,
    refreshParentWindow;

var setOptions = {
    store: {
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
                                        return {
                                            key: ss.id,
                                            value: '',
                                            type: ss.type,
                                            isRight: 0
                                        };
                                    }),
                                    type: q.type,
                                    isRight: constant.ZERO
                                };
                            }
                            return { key: q.id, value: '', type: q.type, isRight: constant.ZERO };
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
                        var me = this,
                            goals = $('[name="goal"]'),
                            flag = _.every(goals, function(goal) {
                                return checkScore.call(me.module, goal);
                            });

                        if (!flag) {
                            return false;
                        }

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
                    me.module.dispatch('clearModels');
                    setTimeout(function() {
                        refreshParentWindow();
                        window.close();
                    }, 500);
                });
            }
        }
    }
};

var models = D.assign({}, options.store.models);
var callbacks = D.assign({}, options.store.callbacks);

var target = D.assign({}, {
    items: options.items,
    store: {
        models: D.assign(models, setOptions.store.models),
        callbacks: D.assign(callbacks, setOptions.store.callbacks)
    },
    beforeRender: function() {
        return this.dispatch('init', this.renderOptions);
    },
    getCurrentStatus: function(id) {
        var grades = this.store.models.grades.data || [],
            grade = _.find(grades, ['key', id]),
            reading;
        if (grade && grade.value.length > 0) {
            reading = _.some(grade.value, function(v) {
                return v.value !== 0;
            });
            if (reading) {
                return itemStatus.ACTIVE;
            }
        } else if (grade && grade.value !== '' && grade.value !== 0) {
            return itemStatus.ACTIVE;
        }
        return itemStatus.INIT;
    }
});

module.exports = target;

checkScore = function(e) {
    var el = e,
        value = $(el).val();

    markers.text.valid($(el));
    if (!validator.required.fn(value)) {
        this.app.message.error('必填项');
        return false;
    }

    if (!validator.digits.fn(value)) {
        this.app.message.error('只能填整数');
        $(el).val('');
        return false;
    }

    if (!validator.keepDecimal.fn(value, 1)) {
        this.app.message.error('只能保留1位小数');
        $(el).val('');
        return false;
    }

    if (!validator.range.fn(value, 0, 100)) {
        this.app.message.error('只能填0分~100分');
        $(el).val('');
        return false;
    }
    return true;
};

//  暂时用这种方式刷新父窗口
/* eslint-disable no-underscore-dangle */
refreshParentWindow = function() {
    var parent = window.opener.app,
        markPaperListMod;

    _.forEach(parent._modules, function(v, k) {
        if (k.indexOf('mark-paper') > -1) markPaperListMod = v;
    });

    return markPaperListMod.dispatch('init');
};

