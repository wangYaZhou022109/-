var $ = require('jquery');

exports.bindings = {
    params: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this,
            searchStatus = '';
        if (el) {
            searchStatus = el;
        }
        me.module.dispatch('search', { searchStatus: searchStatus });
    }
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            name: $(this.$$('[name="activity-name"]')).val()
        };
    }
};
exports.dataForTemplate = {
    currentStep: function(data) {
        var step = data.params.searchStatus;
        return {
            all: !step || step === '',
            running: step === 1 || step === '1',
            notStart: step === 2 || step === '2',
            finish: step === 3 || step === '3'
        };
    }
};
