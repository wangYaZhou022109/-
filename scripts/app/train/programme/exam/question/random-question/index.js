var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    maps = require('./app/util/maps');

exports.large = true;

exports.title = '随机组卷';

exports.items = {
    organization: 'organization',
    depot: 'depot',
    'question-setting': 'question-setting',
    'setting-popup': 'setting-popup'
};

exports.store = {
    models: {
        search: {},
        questions: {
            url: '../exam/question-depot/random-questions',
            mixin: {
                useableAmount: function(type, difficulty) {
                    return _.filter(this.data, function(q) {
                        return Number(q.type) === Number(type) && Number(q.difficulty) === Number(difficulty);
                    }).length;
                }
            }
        },
        tactics: {
            url: '../exam/paper-tactic',
            type: 'localStorage',
            data: {},
            mixin: {
                saveIt: function(obj) {
                    var tactics = _.reject(this.data, function(d) {
                        return d && obj.organizationId === d.organizationId
                            && obj.questionDepotId === d.questionDepotId
                            && Number(obj.type) === Number(d.type)
                            && Number(obj.difficulty) === Number(d.difficulty);
                    });
                    tactics.push(obj);
                    this.data = tactics;
                    this.save();
                },
                getIt: function(org, depot, type, diff) {
                    return _.find(this.data, function(d) {
                        return d && d.organizationId === org
                            && d.questionDepotId === depot
                            && Number(d.type) === Number(type)
                            && Number(d.difficulty) === Number(diff);
                    });
                },
                removeIt: function(org, depot, type, diff) {
                    this.data = _.reject(this.data, function(d) {
                        return d && d.organizationId === org
                            && d.questionDepotId === depot
                            && Number(d.type) === Number(type)
                            && Number(d.difficulty) === Number(diff);
                    });
                },
                totalAmount: function() {
                    return _.reduce(_.map(this.data, function(t) {
                        return (t.amount && Number(t.amount)) || 0;
                    }), function(sum, n) {
                        return sum + n;
                    }, 0);
                },
                totalScore: function() {
                    return _.reduce(_.map(this.data, function(t) {
                        return (t.score && (Number(t.score) * t.amount)) || 0;
                    }), function(sum, n) {
                        return sum + n;
                    }, 0) / 100;
                }
            }
        },
        setting: {
            mixin: {
                init: function(organizationId, questionDepotId) {
                    var questions = this.module.store.models.questions,
                        tactics = this.module.store.models.tactics;
                    this.data = _.map(maps.get('question-types'), function(qt) {
                        return {
                            id: qt.key,
                            title: qt.value,
                            diffcults: _.map(maps.get('question-difficultys'), function(d) {
                                var used = tactics.getIt(organizationId, questionDepotId, qt.key, d.key);
                                return {
                                    id: organizationId + '/' + questionDepotId + '/' + qt.key + '/' + d.key,
                                    type: qt.key,
                                    difficulty: d.key,
                                    title: d.value + '难度',
                                    useableAmount: questions.useableAmount(qt.key, d.key),
                                    usedAmount: used && used.amount,
                                    totalScore: used && used.score,
                                    orgId: organizationId,
                                    depotId: questionDepotId,
                                    show: questions.useableAmount(qt.key, d.key) > 0,
                                    tacticId: (used && used.id) || ''
                                };
                            })
                        };
                    });
                },
                getIt: function(type, diff) {
                    var t = _.find(this.data, ['id', type]);
                    return _.find(t.diffcults, ['difficulty', diff]);
                },
                getByTypeAndDifficulty: function(type, diff) {
                    var d = this.getIt(type, diff),
                        tactics = this.module.store.models.tactics;
                    return D.assign(d, {
                        tactic: tactics.getIt(d.orgId, d.depotId, d.type, d.difficulty)
                    });
                },
                saveIt: function(data) {
                    this.data = _.map(this.data, function(t) {
                        if (data.type === t.id) {
                            return D.assign(t, {
                                diffcults: _.map(t.diffcults, function(d) {
                                    if (data.difficulty === d.difficulty) {
                                        return D.assign(d, {
                                            usedAmount: data.amount,
                                            totalScore: data.amount * data.score
                                        });
                                    }
                                    return d;
                                })
                            });
                        }
                        return t;
                    });
                },
                removeIt: function(data) {
                    this.data = _.map(this.data, function(t) {
                        if (data.type === t.id) {
                            return D.assign(t, {
                                diffcults: _.map(t.diffcults, function(d) {
                                    if (data.difficulty === d.difficulty) {
                                        return D.assign(d, {
                                            usedAmount: 0,
                                            totalScore: 0
                                        });
                                    }
                                    return d;
                                })
                            });
                        }
                        return t;
                    });
                }
            }
        },
        popupCurrent: {},
        tacticsForm: {
            url: '../exam/paper-tactic'
        },
        removeTactic: {
            url: '../exam/paper-tactic'
        }
    },
    callbacks: {
        init: function(payload) {
            if (payload.paperClassId) {
                this.models.tacticsForm.set({
                    id: payload.paperClassId
                });
            }
        },
        saveSearch: function(payload) {
            var search = this.models.search,
                questions = this.models.questions,
                tactics = this.models.tactics,
                setting = this.models.setting,
                paperClassId = this.module.renderOptions.paperClassId;
            D.assign(search.data, payload);
            if (search.data.organizationId && search.data.questionDepotId) {
                D.assign(questions.params, search.data);

                if ((!tactics.data || tactics.data.length === 0) && paperClassId) {
                    D.assign(tactics.data = {}, { id: paperClassId });
                    if (tactics.data.id) {
                        this.get(tactics);
                    }
                }

                return this.get(questions).then(function() {
                    setting.init(search.data.organizationId, search.data.questionDepotId);
                    setting.changed();
                });
            }
            return '';
        },
        clearDepotId: function() {
            var search = this.models.search,
                setting = this.models.setting,
                questions = this.models.questions;
            D.assign(search.data, { questionDepotId: null });
            questions.clear();
            setting.init(search.data.organizationId, search.data.questionDepotId);
            setting.changed();
        },
        addTactic: function(payload) {
            var setting = this.models.setting;
            this.models.popupCurrent.set(setting.getByTypeAndDifficulty(payload.type, payload.difficulty));
            this.models.popupCurrent.changed();
        },
        clearCurrent: function() {
            this.models.popupCurrent.clear();
        },
        saveTactic: function(payload) {
            var search = this.models.search,
                tactics = this.models.tactics,
                setting = this.models.setting,
                popupCurrent = this.models.popupCurrent;

            tactics.saveIt({
                organizationId: search.data.organizationId,
                questionDepotId: search.data.questionDepotId,
                difficulty: payload.difficulty,
                type: payload.type,
                amount: payload.amount,
                score: payload.score
            });

            if (tactics.totalScore() > 1000) {
                this.app.message.error('试卷分数不能超出1000分');
                tactics.removeIt(
                    search.data.organizationId,
                    search.data.questionDepotId,
                    payload.type,
                    payload.difficulty
                );
                return false;
            }

            popupCurrent.clear();
            popupCurrent.changed();
            setting.saveIt(payload);
            setting.changed();
            return true;
        },
        removeTactic: function(payload) {
            var me = this,
                tactic = this.models.tactics.getIt(
                    payload.organizationId,
                    payload.questionDepotId,
                    payload.type,
                    payload.difficulty
                ),
                id = tactic && tactic.id;

            this.models.tactics.removeIt(
                payload.organizationId,
                payload.questionDepotId,
                payload.type,
                payload.difficulty
            );
            this.models.setting.removeIt(payload);
            this.models.setting.changed();
            if (id) {
                this.models.removeTactic.set({ id: id });
                return this.del(this.models.removeTactic).then(function() {
                    me.app.message.success('删除成功');
                });
            }
            return '';
        },
        saveAll: function() {
            var tacticsForm = this.models.tacticsForm,
                tactics = this.models.tactics,
                me = this;
            if (tactics.totalScore() > 1000) {
                this.app.message.error('试卷分数不能超出1000分');
                return false;
            }
            D.assign(tacticsForm.data, {
                name: this.module.renderOptions.name,
                totalScore: tactics.totalScore(),
                questionNum: tactics.totalAmount(),
                paperClassTactics: JSON.stringify(tactics.data)
            });
            return this.save(tacticsForm).then(function() {
                me.app.message.success('保存成功');
                me.module.renderOptions.callback(tacticsForm.data.id || '');
                tactics.clear();
            });
        }
    }
};

exports.mixin = {
    nodeChanged: function(data) {
        var view = this.items.depot.getEntities(),
            depot = view && view[0],
            me = this;
        if (depot) {
            return this.dispatch('clearDepotId').then(function() {
                return me.dispatch('saveSearch', data).then(function() {
                    return depot.refreshTree(data);
                });
            });
        }
        return '';
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: '保存',
    fn: function() {
        return this.dispatch('saveAll');
    }
}];
