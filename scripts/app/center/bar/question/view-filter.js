exports.bindings = {
    search: true,
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.auditStatus) search.statusAll = true;
        if (search.auditStatus === '0') search.statusWait = true;
        if (search.auditStatus === '1') search.statusPass = true;
        if (search.auditStatus === '2') search.statusRefuse = true;
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
