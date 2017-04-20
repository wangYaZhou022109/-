exports.bindings = {
    search: true,
};
exports.events = {
    'click sort-*': 'sort',
    'click type-*': 'searchType'
};

exports.handlers = {
    sort: function(id) {
        return this.module.dispatch('search', { orderType: id });
    },
    searchType: function(type) {
        return this.module.dispatch('search', { type: type });
    }
};

exports.dataForTemplate = {
    types: function(data) {
        var types = [
            { text: '全部', value: '' },
            { text: 'excel', value: '4' },
            { text: 'ppt', value: '5' },
            { text: 'pdf', value: '3' },
            { text: 'mp3', value: '1' },
            { text: 'mp4', value: '0' },
            { text: '其他', value: '8' },
        ];
        var type = data.search.type || '';
        types.forEach(function(t) {
            var temp = t || {};
            if (t.value === type) temp.active = true;
        });
        return types;
    },
    sortStatus: function(data) {
        var sort = data.search.orderType;
        return {
            sort0: sort === '0',
            sort1: sort === '1',
            sort2: sort === '2'
        };
    }
};

