var $ = require('jquery');

exports.actions = {
    'click search': 'search'
};

exports.components = [{
    id: 'month',
    name: 'flatpickr',
    options: {
        dateFormat: 'Y-m'
    }
}];

exports.dataForActions = {
    search: function() {
        return {
            MIScode: $(this.$$('[name="MIScode"]')).val(),
            className: $(this.$$('[name="className"]')).val(),
            startTime: $(this.$$('[name="startTime"]')).val()
        };
    }
};
