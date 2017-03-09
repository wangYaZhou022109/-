exports.items = {
    topicsquare: 'topicsquare',
    'ask/topicsquare/applytopic': { isModule: true },
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        state: { auditStatus: 1 }
    },
    callbacks: {
        init: function() {
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init');
};
