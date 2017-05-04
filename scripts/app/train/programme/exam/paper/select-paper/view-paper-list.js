var _ = require('lodash/collection');

exports.bindings = {
    papers: true
};

exports.components = [{
    id: 'pager',
    name: 'pager',
    options: {
        model: 'papers'
    }
}];

exports.events = {
    'click select*': 'selectPaper'
};

exports.handlers = {
    selectPaper: function(id) {
        this.module.dispatch('selectPaper', id);
    }
};

exports.dataForTemplate = {
    papers: function(data) {
        if (data.papers) {
            return _.map(data.papers, function(p) {
                var pp = p;
                pp.totalScore = p.totalScore / 100;
                return pp;
            });
        }
        return [];
    }
};
