var maps = require('./app/util/maps'),
    $ = require('jquery');

exports.components = [{
    id: 'status',
    name: 'selectize'
}, {
    id: 'start-time',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'end-time',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, function() {
    var data = {
        id: 'owner',
        name: 'picker',
        options: {
            module: 'exam/exam',
            picker: 'owner',
            required: true,
            params: { operatorType: this.app.global.EDIT },
            inputName: 'organizationId'
        }
    };
    return data;
}];

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            memberName: $(this.$$('[name="memberName"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            status: $(this.$$('[name="status"]')).val(),
            createTime: $(this.$$('[name="createTime"]')).val()
        };
    }
};

exports.dataForTemplate = {
    status: function() {
        var status = maps.get('signup-status');
        return status;
    }
};
