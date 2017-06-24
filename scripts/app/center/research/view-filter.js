
exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.status) search.all = true;
        if (search.status === 'wait-join') search.waitJoin = true;
        if (search.status === 'wait-start') search.waitStart = true;
        if (search.status === 'finished') search.finished = true;
        return search;
    }
};

exports.actions = {
    'click search': 'search',
    'keypress name': 'enterSearch'
};

exports.dataForActions = {
    search: function(payload) {
        var data = payload;
        data.status = this.bindings.search.data.status;
        return data;
    },
    enterSearch: function(payload, e) {
        if (e.keyCode !== 13) return false;
        return payload;
    }
};

exports.events = {
    'click item-*': 'search',
    'click joinTimeOrderBy': 'joinTimeOrderBy'
};

exports.handlers = {
    search: function(status) {
        return this.module.dispatch('search', {
            status: status === 'all' ? '' : status,
            name: this.$('name').value
        });
    },
    joinTimeOrderBy: function() {
        var search = this.bindings.search.data;
        this.module.dispatch('search', {
            joinTimeOrderBy: search.joinTimeOrderBy === 1 ? 0 : 1
        });
    }
};

