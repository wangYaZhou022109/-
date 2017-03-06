
// exports.bindings = {
//     classTwoBrings: true
// };

// exports.type = 'form';

// // exports.actions = {
// //     'click search': 'search'
// // };

// // exports.dataForActions = {
// //     search: function(data) {
// //         return data;
// //     }
// // };

// // exports.components = [function() {
// //     var operatorType = this.app.global.EDIT,
// //         data = {},
// //         project = this.bindings.project.data;
// //     if (project.organization) {
// //         data.value = project.organization.id;
// //         data.text = project.organization.name;
// //     }
// //     return {
// //         id: 'owner',
// //         name: 'picker',
// //         options: {
// //             module: 'train/project',
// //             picker: 'owner',
// //             required: false,
// //             params: { operatorType: operatorType },
// //             data: data
// //         }
// //     };
// // }];

var $ = require('jquery');

exports.bindings = {
    classTwoBrings: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        return {
            classId: 3,
            memberName: $(this.$$('[name="name"]')).val(),
            memberFullName: $(this.$$('[name="fullName"]')).val(),
            organizationName: $(this.$$('[name="organizationName"]')).val()
        };
    }
};
