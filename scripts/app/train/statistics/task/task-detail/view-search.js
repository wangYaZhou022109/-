var $ = require('jquery');

exports.bindings = {
    taskDetail: true,
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val(),
        };
    }
};
