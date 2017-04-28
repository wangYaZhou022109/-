var $ = require('jquery');

exports.bindings = {
    search: true,
    state: true
};

exports.actions = {
    'click search': 'refreshList'
};

exports.components = [{
    id: 'sign-up-time',
    name: 'flatpickr'
}];

exports.dataForActions = {
    refreshList: function() {
        return {
            name: $(this.$$('[name="name"]')).val(),
            createTime: $(this.$$('[name="createTime"]')).val()
        };
    }
};
