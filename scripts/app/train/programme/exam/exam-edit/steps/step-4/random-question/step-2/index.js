var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    initTable;
exports.large = true;
exports.items = {
    'setting-score': 'setting-score'
};

exports.store = {
    models: {
        scoreTable: { data: { rows: [] } }
    },
    callbacks: {
        reloadScoreTable: function() {
            var me = this,
                scoreTable = me.models.scoreTable.data,
                rows = scoreTable.rows = initTable();
            scoreTable.total3 = { amount: 0, score: 0 };
            scoreTable.total2 = { amount: 0, score: 0 };
            scoreTable.total1 = { amount: 0, score: 0 };
            scoreTable.total = { amount: 0, score: 0 };
            me.module.renderOptions.getAllTactics().then(function(paperClassTactics) {
                _.forEach(paperClassTactics, function(t) {
                    var target = _.find(rows, { type: t.type }),
                        sore = (t.amount || 0) * (t.score || 0);
                    if (target) {
                        if (!target['d' + t.difficulty]) target['d' + t.difficulty] = { amount: 0, score: 0 };
                        if (!target.total) target.total = { amount: 0, score: 0 };
                        target['d' + t.difficulty].amount += t.amount || 0;
                        target['d' + t.difficulty].score = t.score || 0;
                        scoreTable['total' + t.difficulty].amount += t.amount || 0;
                        scoreTable['total' + t.difficulty].score += sore;
                        scoreTable['total' + t.difficulty].score = Number((scoreTable['total' + t.difficulty].score).toFixed(1)); // eslint-disable-line max-len
                        target.total.amount += t.amount || 0;
                        target.total.score += sore;
                        target.total.score = Number((target.total.score).toFixed(1));
                        scoreTable.total.amount += t.amount || 0;
                        scoreTable.total.score += sore;
                        scoreTable.total.score = Number((scoreTable.total.score).toFixed(1));
                    }
                });
                me.models.scoreTable.changed();
            });
        }
    }
};

initTable = function() {
    var types = maps.get('question-types'),
        row,
        table = [];
    _.forEach(types, function(t) {
        row = {
            id: t.key,
            type: Number(t.key),
            typeName: t.value
        };
        table.push(row);
    });
    return table;
};

exports.afterRender = function() {
    this.dispatch('reloadScoreTable');
};
