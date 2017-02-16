var $ = require('jquery');

exports.bindings = {
    classstaffs: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            classId: 3,
            memberName: $(this.$$('[name="memberName"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val()
        };
    }
};
