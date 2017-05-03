exports.type = '班级详情页';
exports.bindings = {
    classId: true,
    bus: true
};

exports.events = {
    'click commitTask': 'showTaskList',
    'click classMembers': 'classMembers',
    'click addCourse1': 'addCourse1'
};

exports.handlers = {
    showTaskList: function() {
        var view = this.module.items['train/class-detail/commit-task'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    },
    classMembers: function() {
        var view = this.module.items['train/class-detail/school-yearbook'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    },
    addCourse1: function() {
        var me = this;
        return this.module.dispatch('getRecordByResearch').then(function() {
            me.app.viewport.modal(me.module.items['research-tips']);
        });
    }
};

exports.actions = {
    'click shuttleBusInformation': 'shuttleBusInformation',
    'click twoBring': 'twoBring',
    'click questionnaire': 'questionnaire',
};

exports.actionCallbacks = {
    twoBring: function() {
        this.app.viewport.modal(this.module.items['two-brings']);
    },
    shuttleBusInformation: function() {
        this.app.viewport.modal(this.module.items.bus);
    },
    questionnaire: function() {
        this.app.viewport.modal(this.module.items.questionnaire);
    },
};
