exports.type = '班级详情页';
exports.bindings = {
    classId: true,
    fmtrainees: true,
    bus: true
};

exports.actions = {
    'click classMembers': 'fmtrainees',
    'click shuttleBusInformation': 'shuttleBusInformation',
};

exports.actionCallbacks = {
    fmtrainees: function() {
        this.app.viewport.modal(this.module.items.fmtrainees);
    },
    shuttleBusInformation: function() {
        this.app.viewport.modal(this.module.items.bus);
    }
};
