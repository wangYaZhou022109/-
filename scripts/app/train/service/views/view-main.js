exports.type = '班级详情页';
exports.bindings = {
    classId: true,
    fmtrainees: true,
};

exports.events = {
};

exports.handlers = {

};

exports.actions = {
    'click classMembers': 'fmtrainees',
    'click twoBring': 'twoBring',
    'click questionnaire': 'questionnaire',
};

exports.actionCallbacks = {
    fmtrainees: function() {
        this.app.viewport.modal(this.module.items.fmtrainees);
    },
    twoBring: function() {
        this.app.viewport.modal(this.module.items.twoBrings);
    },
    questionnaire: function() {
        this.app.viewport.modal(this.module.items.questionnaire);
    },
};
