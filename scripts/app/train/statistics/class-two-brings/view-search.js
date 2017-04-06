
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
var $ = require('jquery');

exports.components = [function() {
    var operatorType = this.app.global.EDIT,
        data = {};
    return {
        id: 'owner',
        name: 'picker',
        options: {
            module: 'train/project',
            picker: 'owner',
            required: false,
            params: { operatorType: operatorType },
            data: data
        }
    };
}];

exports.bindings = {
    classTwoBrings: true
};

exports.actions = {
    'click search': 'search'
};

exports.events = {
    'click showOrganization': 'show'
};

exports.actions = {
    'click edit*': 'edit',
};

exports.handlers = {
    show: function() {
        var me = this,
            model = me.module.items['train/statistics/classTwoBrings/owner'];
        me.app.viewport.modal(model, { module: 'train/project',
            callback: function() {
            }
        });
    }
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
