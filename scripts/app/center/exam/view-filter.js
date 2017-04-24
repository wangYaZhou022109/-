
exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        return {
            all: search.searchStatus === null,
            waitStart: search.searchStatus === 1,
            begining: search.searchStatus === 2,
            finished: search.searchStatus === 3,
            allType: search.type === null,
            formal: search.type === 1,
            unFormal: search.type === 2,
            name: search.name
        };
    }
};

exports.events = {
    'click item-*': 'selectItem',
    'click type-*': 'selectType',
    'click start-time-order': 'selectStartTimeOrder'
};

exports.handlers = {
    selectItem: function(value) {
        return this.module.dispatch('selectItem', { searchStatus: Number(value) === 0 ? null : Number(value) });
    },
    selectType: function(value) {
        return this.module.dispatch('selectItem', { type: Number(value) === 0 ? null : Number(value) });
    },
    selectStartTimeOrder: function() {
        return this.module.dispatch('selectItem', { startTimeOrderBy: 1 });
    }
};

exports.actions = {
    'click search': 'selectItem'
};

exports.dataForActions = {
    selectItem: function() {
        return { name: this.$('name').value };
    }
};

