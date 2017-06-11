var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.bindings = {
    setting: true,
    tactics: false
};


exports.events = {
    'click add-*': 'addTactic',
    'click remove-*': 'removeTactic'
};

exports.handlers = {
    addTactic: function(id) {
        var arr = id.split('/');
        return this.module.dispatch('addTactic', {
            organizationId: arr[0],
            questionDepotId: arr[1],
            type: arr[2],
            difficulty: arr[3]
        });
    },
    removeTactic: function(id) {
        var arr = id.split('/'),
            me = this;
        this.app.message.confirm('确定要删除该数据？', function() {
            return me.module.dispatch('removeTactic', {
                organizationId: arr[0],
                questionDepotId: arr[1],
                type: arr[2],
                difficulty: arr[3]
            });
        });
    }
};

exports.dataForTemplate = {
    summary: function(data) {
        var obj = {};
        if (data.tactics && data.tactics.length > 0) {
            obj = {
                totalAmount: _.reduce(_.map(data.tactics, function(t) {
                    return (t.amount && Number(t.amount)) || 0;
                }), function(sum, n) {
                    return sum + n;
                }, 0),
                totalScore: _.reduce(_.map(data.tactics, function(t) {
                    return (t.score && (Number(t.score) * t.amount)) || 0;
                }), function(sum, n) {
                    return sum + n;
                }, 0) / 100,
            };
        }
        return obj;
    },
    setting: function(data) {
        return _.map(data.setting, function(s) {
            return D.assign(s, {
                diffcults: _.map(s.diffcults, function(d) {
                    return D.assign(d, { totalScore: d.totalScore / 100 });
                })
            });
        });
    }
};
