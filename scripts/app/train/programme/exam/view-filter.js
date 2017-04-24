var _ = require('lodash/collection'),
    maps = require('./app/util/maps');

exports.dataForTemplate = {
    type: function() {
        return maps.get('exam-type');
    },
    status: function() {
        var result = _.filter(maps.get('exam-status'), function(s) {
            return Number(s.key) !== 0;
        });
        result.unshift({ key: '999', value: '全部' });
        return result;
    }
};

exports.components = [{
    id: 'type',
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
}, {
    id: 'status',
    name: 'selectize'
}, {
    id: 'ownerOrganization',
    name: 'picker',
    options: {
        module: 'exam/exam',
        picker: 'owner',
        inputName: 'organizationId'
    }
}];
