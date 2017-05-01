var _ = require('lodash/collection');
var D = require('drizzlejs');
exports.large = true;
exports.title = '随机组卷';
exports.items = {
    tab: 'top'
};

exports.store = {
    models: {
        currentStep: {
            data: { amount: true, score: false }
        },
        paperClass: { url: '../exam/paper-class' },
        paperTacticsForm: { url: '../exam/paper-class/tactics' },
        paperClassTactics: {}
    },
    callbacks: {
        init: function(paperClassId) {
            var me = this;
            if (paperClassId) {
                me.models.paperClass.data = { id: paperClassId };
                me.get(me.models.paperClass).then(function() {
                    me.models.paperClassTactics.data = me.models.paperClass.data.paperClassTactics;
                    me.models.paperClassTactics.changed();
                });
            } else {
                me.models.paperClassTactics.data = [];
            }
        },
        setTacticStep: function(step) {
            var currentStep = {};
            currentStep[step] = true;
            this.models.currentStep.set(currentStep);
            return this.models.currentStep.changed();
        },
        setTacticSummary: function(tatics) {
            var paperClass = {
                name: '随机组卷-' + new Date().getTime(),
                totalScore: 0,
                questionNum: 0,
                organizationId: this.module.renderOptions.organizationId,
                paperClassTactics: [],
            };
            tatics.forEach(function(t) {
                paperClass.questionNum += t.amount;
                paperClass.totalScore += t.amount * t.score * 100;
            });
            paperClass.paperClassTactics = JSON.stringify(tatics);
            this.models.paperTacticsForm.data = D.assign(this.models.paperClass.data, paperClass);
            return this.save(this.models.paperTacticsForm);
        },
        saveTactic: function(t) {
            var target,
                paperClassTactics = this.models.paperClassTactics.data;
            target = _.find(paperClassTactics, {
                organizationId: t.organizationId,
                questionDepotId: t.questionDepotId,
                type: t.type,
                difficulty: t.difficulty
            });
            if (target) {
                target.amount = t.amount;
                target.score = t.score;
            } else {
                paperClassTactics.push(t);
            }
            return this.models.paperClassTactics.changed();
        },
        getPaperClassTactics: function(params) {
            return _.filter(this.models.paperClassTactics.data, params);
        },
        getAllTactics: function() {
            return this.models.paperClassTactics.data || [];
        },
        removeTactic: function(params) {
            var paperClassTactics = this.models.paperClassTactics.data;
            paperClassTactics.map(function(t) {
                var obj = t;
                if (t.organizationId === params.organizationId
                    && t.questionDepotId === params.questionDepotId
                    && t.type === params.type
                    && t.difficulty === params.difficulty) {
                    obj.amount = 0;
                    obj.score = 0;
                    return obj;
                }
                return obj;
            });
            return this.models.paperClassTactics.changed();
        }
    }
};

exports.afterRender = function() {
    var me = this,
        paperClassId = me.renderOptions.paperClassId;
    me.dispatch('setTacticStep', 'amount');
    me.dispatch('init', paperClassId);
};
exports.buttons = function() {
    var me = this,
        currentStep = me.store.models.currentStep.data,
        btns = [],
        nextBtn = {
            text: '下一步',
            fn: function() {
                var view = me.items.tab.getEntities()[0];
                if (view.isValidator && !view.isValidator()) {
                    return false;
                }
                me.dispatch('setTacticStep', 'score');
                return false;
            }
        },
        preBtn = {
            text: '上一步',
            fn: function() {
                var view = me.items.tab.getEntities()[0];
                if (view.isValidator && !view.isValidator()) {
                    return false;
                }
                me.dispatch('setTacticStep', 'amount');
                return false;
            }
        },
        saveBtn = {
            text: '保存',
            fn: function() {
                var scoreTable = me.store.models.paperClassTactics.data,
                    view = me.items.tab.getEntities()[0];
                if (view.isValidator && !view.isValidator()) {
                    return false;
                }
                me.dispatch('setTacticSummary', scoreTable).then(function(data) {
                    me.renderOptions.callback(data[0].id);
                });
                return false;
            }
        };
    if (currentStep.amount) {
        btns.push(nextBtn);
    } else {
        btns.push(preBtn);
        btns.push(saveBtn);
    }
    return btns;
};
