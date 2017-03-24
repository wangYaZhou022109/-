exports.type = '班级详情页';
exports.bindings = {
    classId: true,
    fmtrainees: true,
};

exports.actions = {
    'click classMembers': 'fmtrainees',
};

exports.actionCallbacks = {
    fmtrainees: function() {
        this.app.viewport.modal(this.module.items.fmtrainees);
    }
};
