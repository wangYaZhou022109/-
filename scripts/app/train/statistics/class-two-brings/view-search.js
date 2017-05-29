
var $ = require('jquery');

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
            classId: this.bindings.state.data.classId,
            name: $(this.$$('[name="name"]')).val(),
            fullName: $(this.$$('[name="fullName"]')).val(),
            organizationId: $(this.$$('[name="organizationId"]')).val()
        };
    }
};

