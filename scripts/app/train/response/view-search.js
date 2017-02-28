var maps = require('./app/util/maps'),
    $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    classinfos: true
};

exports.components = [{
    id: 'classStatus',
    name: 'selectize'
}];

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        var data = {
            MIScode: $(this.$$('[name="MIScode"]')).val(),
            className: $(this.$$('[name="className"]')).val(),
            classStatus: $(this.$$('[name="classStatus"]')).val()
        };
        _.forEach(data, function(v, k) {
            if (k === 'classStatus') {
                if (v === '999') {
                    data.classStatus = '';
                }
            }
        });
        return data;
    }
};

exports.dataForTemplate = {
    classStatus: function() {
        var result = maps.get('classinfo-status').sort(function(a, b) {
            return Number(a.key) - Number(b.key);
        });
        result.unshift({ key: '999', value: '全部' });
        return result;
    },
};
