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
    'click type-*': 'type',
    'click timeOrder': 'timeOrder'
};

exports.handlers = {
    type: function(type) {
        var params = {
            type: type === 'all' ? '' : type
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
