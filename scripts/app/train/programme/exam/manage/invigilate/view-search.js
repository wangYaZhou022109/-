var maps = require('./app/util/maps'),
    $ = require('jquery');
exports.type = 'form';

exports.bindings = {
    exams: true
};

exports.components = [{
    id: 'status',
    name: 'selectize'
}, function() {
    return {
        id: 'owner',
        name: 'picker',
        options: {
            module: 'exam/exam',
            picker: 'owner',
            inputName: 'organizationId',
            data: {}
        }
    };
}, {
    id: 'exam',
    name: 'selectize'
}, {
    id: 'clientType',
    name: 'selectize'
}, {
    id: 'type',
    name: 'selectize'
}];

exports.actions = {
    'click search': 'search'
};
exports.dataForActions = {
    search: function() {
        return {
            memberName: $(this.$$('[name="memberName"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            organizationId: $('input[name="organizationId"]').val(),
            clientType: $(this.$$('[name="clientType"]')).val(),
            status: $(this.$$('[name="status"]')).val(),
            type: $(this.$$('[name="type"]')).val()
        };
    }
};

exports.dataForTemplate = {
    status: function() {
        var status = maps.get('paper-instance-status');
        return status;
    },
    type: function() {
        var type = maps.get('exam-is-retest');
        return type;
    }
};
