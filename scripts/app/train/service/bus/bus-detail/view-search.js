var $ = require('jquery');

exports.bindings = {
    busDetail: true,
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            state: $(this.$$('[name="state"]')).val()
        };
    }
};
