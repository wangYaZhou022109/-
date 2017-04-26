var trim;
exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        return {
            all: search.searchStatus === null,
            waitExam: search.searchStatus === 1,
            waitStart: search.searchStatus === 2,
            waitApprove: search.searchStatus === 3,
            finished: search.searchStatus === 4,
            allType: search.type === null,
            formal: search.type === 1,
            unFormal: search.type === 2,
            name: search.name,
            startTimeOrderBy: search.startTimeOrderBy
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
        var search = this.bindings.search.data;
        return this.module.dispatch('selectItem', {
            startTimeOrderBy: search.startTimeOrderBy === 1 ? 0 : 1
        });
    }
};

exports.actions = {
    'click search': 'selectItem'
};

exports.dataForActions = {
    selectItem: function() {
        return { name: trim(this.$('name').value) };
    }
};

trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};
