var D = require('drizzlejs');

exports.bindings = {
    search: true
};

exports.events = {
    'click item-*': 'search',
    'click search-*': 'search'
};

exports.handlers = {
    search: function(id) {
        var data = {};
        if (id) {
            D.assign(data, { status: Number(id) === 0 ? null : id });
        } else {
            D.assign(data, { name: this.$('name').value });
        }
        return this.module.dispatch('search', data);
    }
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        return D.assign(search, {
            all: !search.status,
            unFinished: Number(search.status) === 1,
            unStarted: Number(search.status) === 2
        });
    }
};
