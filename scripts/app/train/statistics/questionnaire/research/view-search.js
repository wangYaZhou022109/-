
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

exports.bindings = {
    state: false
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            resourceId: this.bindings.state.data.id,
            classId: this.bindings.state.data.classId,
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val()
        };
    }
};
