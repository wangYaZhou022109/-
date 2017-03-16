exports.bindings = {
    search: 'changeSearch',
};
exports.events = {
    'click sort-*': 'sort'
};

exports.handlers = {
    sort: function(id) {
        return this.module.dispatch('search', { orderType: id });
    }
};
