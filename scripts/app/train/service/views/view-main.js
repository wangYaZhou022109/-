exports.type = '班级详情页';
exports.bindings = {
    classId: true,
    fmtrainees: true,
};

exports.events = {
<<<<<<< Updated upstream
};

exports.handlers = {

=======
    'click commitTask': 'showTaskList'
};

exports.handlers = {
    showTaskList: function() {
        var view = this.module.items['train/service/views/commit-task'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    }
>>>>>>> Stashed changes
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

