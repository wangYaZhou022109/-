var _ = require('lodash/collection');

exports.title = '报名情况列表';

exports.bindings = {
    situation: true
};

exports.small = true;

exports.dataForTemplate = {
    trainees: function(data) {
        var situation = data.situation;
        if (situation.signUpNumber === null) {
            situation.signUpNumber = 0;
        }
        if (situation.amount === null) {
            situation.amount = 0;
        }
        _.map(situation.classQuotaDetails || [], function(cqd, i) {
            var e = cqd;
            if (e.signUpNumber === null) {
                e.signUpNumber = 0;
            }
            if (e.quantity === null) {
                e.quantity = 0;
            }
            e.i = i + 1;
        });
        return data;
    }
};
