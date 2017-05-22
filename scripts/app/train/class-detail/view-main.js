exports.bindings = {
    classId: true,
    bus: true,
    trainee: true
};

exports.events = {
    'click commitTask': 'showTaskList',
    'click classMembers': 'classMembers',
    'click addCourse1': 'addCourse1',
    'click shuttleBusInformation': 'shuttleBusInformation'
};

exports.handlers = {
    showTaskList: function() {
        var view = this.module.items['train/class-detail/commit-task'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    },
    shuttleBusInformation: function() {
        var view = this.module.items['train/class-detail/class-bus'];
        var classId = this.bindings.classId.data.classId;
        this.app.viewport.modal(view, { classId: classId });
    },
    classMembers: function() {
        var classId = this.bindings.classId.data.classId;
        this.app.show('content', 'train/classmate-book', { classId: classId });
    },
    addCourse1: function() {
        var me = this;
        return this.module.dispatch('getRecordByResearch').then(function() {
            me.app.viewport.modal(me.module.items['research-tips']);
        });
    }
};

exports.actions = {
    'click twoBring': 'twoBring',
    'click questionnaire': 'questionnaire',
};

exports.actionCallbacks = {
    twoBring: function() {
        this.app.viewport.modal(this.module.items['two-brings']);
    },
    questionnaire: function() {
        this.app.viewport.modal(this.module.items.questionnaire);
    }
};

exports.dataForTemplate = {
    isGrant: function() {
        var trainee = this.bindings.trainee.data || {};
        if (trainee.id) {
            return true;
        }
        return false;
    }
};
