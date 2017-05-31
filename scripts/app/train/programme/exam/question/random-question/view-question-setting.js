var _ = require('lodash/collection');

exports.bindings = {
    setting: true
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
        var obj = {
            totalAmount: _.reduce(_.map(_.flatMap(data.setting, function(s) {
                return s.diffcults;
            }), function(d) {
                return (d.usedAmount && Number(d.usedAmount)) || 0;
            }), function(sum, n) {
                return sum + n;
            }, 0),
            totalScore: _.reduce(_.map(_.flatMap(data.setting, function(s) {
                return s.diffcults;
            }), function(d) {
                return (d.totalScore && Number(d.totalScore)) || 0;
            }), function(sum, n) {
                return sum + n;
            }, 0),
        };
        return obj;
    }
};
