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
        return search;
    }
};

exports.events = {
    'click status-*': 'selectStatus',
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
    startTimeOrderBy: function() {
        var search = this.bindings.search.data;
        this.module.dispatch('search', {
            startTimeOrderBy: search.startTimeOrderBy === 1 ? 0 : 1
        });
    },
    searchByName: function() {
        var name = $(this.$$('[name="live-name"]')).val();
        this.module.dispatch('search', { subject: name });
    }
};

exports.actions = {
    'keypress live-name': 'enterSearch'
};

exports.dataForActions = {
    enterSearch: function(payload, e) {
        var name = $(this.$$('[name="live-name"]')).val();
        if (e.keyCode !== 13) return false;
        return { subject: name };
    }
};
