var maps = require('./app/util/maps'),
    D = require('drizzlejs');

exports.components = [{
    id: 'status',
    name: 'selectize'
}, {
    id: 'joinTime',
    name: 'flatpickr',
    options: {
        enableTime: true,
        mode: 'range'
    }
}];

exports.dataForTemplate = {
    status: function() {
        var result = maps.get('research-record-status');
        result.unshift({ key: '999', value: '全部' });
        return result;
    }
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function(data) {
        var joinTimeRange = data.joinTime || 'to';
        return D.assign(data, {
            createTimeStart: joinTimeRange.split('to')[0],
            createTimeEnd: joinTimeRange.split('to')[1],
            status: data.status === '999' ? null : data.status
        });
    }
};
