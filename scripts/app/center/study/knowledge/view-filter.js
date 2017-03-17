exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.auditStatus) search.statusAll = true;
        if (search.auditStatus === '0') search.statusa = true;
        if (search.auditStatus === '1') search.statusb = true;
        if (search.auditStatus === '2') search.statusc = true;
        return search;
    }
};

exports.actions = {
    'click searchByName': 'search'
};

exports.events = {
    'click selectStatus-*': 'selectStatus',
    'click timeOrder': 'timeOrder'
};

exports.handlers = {
    selectStatus: function(status) {
        var params = {
            auditStatus: status === 'all' ? '' : status
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
