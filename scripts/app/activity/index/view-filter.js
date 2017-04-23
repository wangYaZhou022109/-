exports.bindings = {
    search: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(value) {
        return this.module.dispatch('search', { searchStatus: value === 0 ? null : Number(value) });
    }
};

exports.dataForTemplate = {
    currentStep: function(data) {
        var search = data.search;
        return {
            all: search.searchStatus === 0,
            running: search.searchStatus === 1,
            notStart: search.searchStatus === 2,
            finish: search.searchStatus === 3,
        };
    }
};
