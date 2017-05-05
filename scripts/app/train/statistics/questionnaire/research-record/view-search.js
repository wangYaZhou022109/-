
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
    state: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            researchQuestionaryId: this.bindings.state.data.resourceId,
            businessId: this.bindings.state.data.classId,
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val(),
            startTimeStart: $(this.$$('[name="startTime"]')).val()
        };
    }
};

exports.components = [{
    id: 'sign-up-time',
    name: 'flatpickr'
}];
