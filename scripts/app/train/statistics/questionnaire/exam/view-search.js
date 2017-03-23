
// exports.type = 'form';

// // exports.actions = {
// //     'click search': 'search'
// // };

// // exports.dataForActions = {
// //     search: function(data) {
// //         return data;
// //     }
// // };
var $ = require('jquery');
var maps = require('./app/util/maps');

exports.bindings = {
    state: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            resourceId: this.bindings.state.data.resourceId,
            classId: this.bindings.state.data.classId,
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val(),
            status: $(this.$$('[name="examStatus"]')).val() === '0' ? '' : $(this.$$('[name="examStatus"]')).val()
        };
    }
};

exports.components = [{
    id: 'examStatus',
    name: 'selectize'
}];

exports.dataForTemplate = {
    examStatus: function() {
        var result = maps.get('paper-instance-status').sort(function(a, b) {
            return Number(a.key) - Number(b.key);
        });
        result.unshift({ key: '0', value: '全部' });
        return result;
    }
};
