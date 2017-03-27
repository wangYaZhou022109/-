var $ = require('jquery');
exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.searchStatus) search.statusAll = true;
        if (search.searchStatus === '1') search.statusa = true;
        if (search.searchStatus === '2') search.statusb = true;
        if (search.searchStatus === '3') search.statusc = true;
        if (search.searchStatus === '4') search.statusd = true;
        if (search.type === '1') search.typea = true;
        if (search.type === '2') search.typeb = true;
        return search;
    }
};

exports.events = {
    'click status-*': 'selectStatus',
    'click type-*': 'selectType',
    'click startTimeOrderBy': 'startTimeOrderBy',
    'click searchByName': 'searchByName'
};

exports.handlers = {
    selectStatus: function(status) {
        var params = {
            searchStatus: status === 'all' ? '' : status
        };
        this.module.dispatch('search', params);
    },
    selectType: function(type) {
        var params = {
            type: type === 'all' ? '' : type
        };
        this.module.dispatch('search', params);
    },
    startTimeOrderBy: function() {
        this.module.dispatch('search', {
            startTimeOrderBy: this.bindings.search.data.startTimeOrderBy
        });
    },
    searchByName: function() {
        var name = $(this.$$('[name="exam-name"]')).val();
        this.module.dispatch('search', { name: name });
    }
};
