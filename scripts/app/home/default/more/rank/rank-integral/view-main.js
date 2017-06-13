var _ = require('lodash/collection');
exports.bindings = {
    integralRank: true,
    myRankCount: true
};

exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    },
    integralRank: function(data) {
        _.map(data.integralRank || [], function(integralRank, i) {
            var r = integralRank;
            r.i = i + 1;
        });
        return data.integralRank;
    },
};

exports.events = {
    'click details-*': 'detail'
};

exports.handlers = {
    detail: function(id) {
        this.app.viewport.closeModal();
        window.location.href = '#/ask/questiondetails/' + id;
    }
};
