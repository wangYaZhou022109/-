exports.type = '班级详情页';
exports.bindings = {
    classId: true,
    bus: true
};

exports.events = {
    'click commitTask': 'showTaskList',
    'click classMembers': 'classMembers'
};

exports.handlers = {
    showTaskList: function() {
        var view = this.module.items['train/service/views/commit-task'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    },
    classMembers: function() {
        var view = this.module.items['train/service/views/school-yearbook'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    }
};

exports.actions = {
    'click shuttleBusInformation': 'shuttleBusInformation',
    'click twoBring': 'twoBring',
    'click questionnaire': 'questionnaire',
};

exports.actionCallbacks = {
    twoBring: function() {
        this.app.viewport.modal(this.module.items.twoBrings);
    },
    shuttleBusInformation: function() {
        this.app.viewport.modal(this.module.items.bus);
    },
    questionnaire: function() {
        this.app.viewport.modal(this.module.items.questionnaire);
    },
};

