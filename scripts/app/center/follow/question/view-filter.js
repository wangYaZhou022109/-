exports.bindings = {
    search: true,
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.type) search.typeAll = true;
        if (search.type === '1') search.typeQuestion = true;
        if (search.type === '2') search.typeShare = true;
        return search;
    }
};

exports.events = {
    'click auditStatus-*': 'selectAudit',
    'click timeOrder': 'timeOrder'
};

exports.handlers = {
    selectAudit: function(auditStatus) {
        var params = {
            auditStatus: auditStatus === 'all' ? '' : auditStatus
        };
        this.module.dispatch('search', params);
    },
    timeOrder: function() {
        var timeOrder = this.bindings.search.data.timeOrder,
            params = {
                timeOrder: timeOrder === 'asc' ? 'desc' : 'asc'
            };
        this.module.dispatch('search', params);
    }
};
