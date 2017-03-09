exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.finishStatus) search.statusAll = true;
        if (search.finishStatus === '0') search.statusa = true;
        if (search.finishStatus === '1') search.statusb = true;
        if (search.finishStatus === '2') search.statusc = true;
        if (!search.isRequired) search.isAll = true;
        if (search.isRequired === '0') search.isx = true;
        if (search.isRequired === '1') search.isb = true;
        return search;
    }
};

exports.actions = {
    'click searchByName': 'search'
};

exports.events = {
    'click selectStatus-*': 'selectStatus',
    'click selectIsRequired-*': 'selectIsRequired',
    'click studyTimeOrder': 'studyTimeOrder'
};

exports.handlers = {
    selectStatus: function(status) {
        var params = {
            finishStatus: status === 'all' ? '' : status
        };
        this.module.dispatch('search', params);
    },
    selectIsRequired: function(isRequired) {
        var params = {
            isRequired: isRequired === 'all' ? '' : isRequired
        };
        this.module.dispatch('search', params);
    },
    studyTimeOrder: function() {
        var studyTimeOrder = this.bindings.search.data.studyTimeOrder,
            params = {
                studyTimeOrder: studyTimeOrder === 'desc' ? 'asc' : 'desc'
            };
        this.module.dispatch('search', params);
    }
};
