var $ = require('jquery');

exports.bindings = {
    signDetail: true,
};

exports.actions = {
    'click search': 'search',
    'click batchStatus': 'batchStatus',
};

exports.dataForActions = {
    search: function() {
        return {
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            state: $(this.$$('[name="state"]')).val()
        };
    }
};
