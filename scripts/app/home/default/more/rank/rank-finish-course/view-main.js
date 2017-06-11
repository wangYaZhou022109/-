var _ = require('lodash/collection');
exports.bindings = {
    studyRank: true,
    myRankCount: true
};

exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    },
    studyRank: function(data) {
        // var me = this;
        _.map(data.studyRank || [], function(studyRank, i) {
            var r = studyRank;
            r.i = i + 1;
        });
        return data.studyRank;
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

