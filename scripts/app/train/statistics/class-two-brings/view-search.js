
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
    classTwoBrings: true,
    state: true,
    org: true
};

exports.actions = {
    'click search': 'search'
};

exports.events = {
    'click showOrganization': 'show'
};

exports.handlers = {
    show: function() {
        var me = this,
            model = me.module.items['train/statistics/navigate-tree'],
            org = me.bindings.org.data;
        me.app.viewport.modal(model, {
            callback: function(payload) {
                org.id = payload.id;
                org.name = payload.name;
                me.bindings.org.changed();
            }
        });
    }
};

exports.dataForActions = {
    search: function() {
        return {
            page: 1,
            pageSize: 100000,
            classId: this.bindings.state.data.classId,
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val(),
            organizationId: $(this.$$('[name="organizationId"]')).val()
        };
    }
};

