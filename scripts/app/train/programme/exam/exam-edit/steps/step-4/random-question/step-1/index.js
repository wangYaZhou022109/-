var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    getParam,
    initTable;
exports.large = true;
exports.items = {
    'dq-table': 'right',
    'human/organization/navigate-tree': {
        isModule: true,
        uri: 'exam/exam'
    }
};

exports.store = {
    models: {
        table: { data: {} },
        questionDepots: { url: '../exam/question-depot/detail' },
        currentOrgId: { data: '' },
        currentTactic: { data: {} },
        tableParams: { data: {} }
    },
    callbacks: {
        reloadTable: function() {
            var me = this,
                params = me.models.tableParams.data,
                table = me.models.table.data,
                qcs = params.depot.questionCounts || [],
                param;
            table.rows = initTable(me.models.currentOrgId.data, params.depot.id);
            table.total = { amount: 0, score: 0 };
            _.map(table.rows, function(e) {
                var row = e;
                param = { questionDepotId: params.depot.id, type: e.type, difficulty: 3 };
                _.forEach([1, 2, 3], function(i) {
                    param.difficulty = i;
                    row['d' + i].amount = getParam(qcs, param, 'amount', 0);
                    if (row['d' + i].amount !== 0) row['d' + i].usable = true;
                    row['d' + i].tacticAmount = getParam(params.paperClassTactics, param, 'amount', 0);
                    row['d' + i].tacticScore = getParam(params.paperClassTactics, param, 'score', 0);
                    row['d' + i].totalScore = row['d' + i].tacticAmount * row['d' + i].tacticScore;
                    table.total.amount += row['d' + i].tacticAmount;
                    table.total.score += row['d' + i].totalScore;
                    table.total.score = Number((table.total.score).toFixed(1));
                });
                return row;
            });
            me.models.table.changed();
        },
        getTactic: function(params) {
            var me = this,
                paperClassTactics = me.models.tableParams.data.paperClassTactics || [];
            return _.find(paperClassTactics, params);
        },
        getQuestionDepots: function(organizationId) {
            this.models.questionDepots.params.organizationId = organizationId;
            return this.get(this.models.questionDepots);
        },
        setCurrentTactic: function(params) {
            var me = this,
                qcs = me.models.tableParams.data.depot.questionCounts || [];
            me.models.currentTactic.data = {
                id: params.organizationId + '|' + params.questionDepotId + '|' + params.type + '|' + params.difficulty,
                organizationId: params.organizationId,
                depotId: params.questionDepotId,
                type: params.type,
                difficulty: params.difficulty,
                amount: params.amount,
                score: params.score
            };
            me.models.currentTactic.data.totalAmount = getParam(qcs, {
                questionDepotId: params.questionDepotId,
                type: params.type,
                difficulty: params.difficulty }, 'amount', 0);
            return me.models.currentTactic.changed();
        },
        clearCurrentTactic: function() {
            this.models.currentTactic.data = {};
            this.models.currentTactic.changed();
        },
        setCurrentOrgId: function(id) {
            this.models.currentOrgId.data = id;
            this.models.currentOrgId.changed();
        },
        setTableParams: function(params) {
            this.models.tableParams.data = params;
            this.models.tableParams.changed();
        }
    }
};

getParam = function(arr, params, resultParam, defaultResult) {
    var target = _.find(arr, params);
    return target && target[resultParam] ? target[resultParam] : defaultResult;
};

initTable = function(orgId, depotId) {
    var types = maps.get('question-types'),
        row,
        table = [];
    _.forEach(types, function(t) {
        row = {
            id: orgId + '|' + depotId + '|' + t.key,
            questionDepotId: depotId,
            type: Number(t.key),
            typeName: t.value,
            d1: { amount: 0, tacticAmount: 0 },
            d2: { amount: 0, tacticAmount: 0 },
            d3: { amount: 0, tacticAmount: 0 }
        };
        table.push(row);
    });
    return table;
};
exports.mixin = {
    reload: function() {
        var me = this,
            tableParams = me.store.models.tableParams.data,
            promise = me.renderOptions.getPaperClassTactics({
                organizationId: me.store.models.currentOrgId.data,
                questionDepotId: tableParams.depot.id
            });
        promise.then(function(v) {
            tableParams.paperClassTactics = v;
            me.dispatch('setTableParams', tableParams);
            me.dispatch('reloadTable');
        });
    }
};
exports.afterRender = function() {
    var me = this,
        depotRenderOptions,
        orgRenderOptions;
    depotRenderOptions = {
        getText: function(depot) {
            var amount = 0;
            if (depot.data.questionCounts) {
                _.forEach(depot.data.questionCounts, function(e) {
                    amount += e.amount;
                    amount = Number((amount).toFixed(1));
                });
                return ' <span class="muted">(' + amount + ')</span>';
            }
            return '';
        },
        nodeChanged: function(node) {
            var promise, params;
            if (!node || !node.id) return;
            promise = me.renderOptions.getPaperClassTactics({
                organizationId: me.store.models.currentOrgId.data,
                questionDepotId: node.id
            });
            params = {
                depot: node && node.data ? node.data : ''
            };
            promise.then(function(value) {
                params.paperClassTactics = value;
                me.dispatch('setTableParams', params);
                me.dispatch('reloadTable');
            });
        }
    };
    orgRenderOptions = {
        nodeChanged: function(node) {
            me.regions.left2.close().then(function() {
                var promise = me.dispatch('getQuestionDepots', node.id);
                promise.then(function() {
                    me.dispatch('setCurrentOrgId', node.id);
                    depotRenderOptions.questionDepots = me.store.models.questionDepots.data;
                    me.regions.left2.show('train/programme/question-depot/question-depot-tree', depotRenderOptions);
                });
            });
        }
    };
    me.regions.left1.close().then(function() {
        me.regions.left1.show(me.items['human/organization/navigate-tree'], orgRenderOptions);
    });
};
