exports.bindings = {
    classId: true,
    bus: true,
    trainee: true,
    state: false,
    signUpInfo: false
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
        var trainee = this.bindings.trainee.data || {};
        this.app.viewport.modal(view, { classId: classId, traineeId: trainee.id });
    },
    shuttleBusInformation: function() {
        var view = this.module.items['train/class-detail/class-bus'];
        var classId = this.bindings.classId.data.classId;
        var trainee = this.bindings.trainee.data || {};
        this.app.viewport.modal(view, { classId: classId, traineeId: trainee.id });
    },
    classMembers: function() {
        var classId = this.bindings.classId.data.classId;
        var see = this.bindings.state.data.see;
        this.app.show('content', 'train/classmate-book', { classId: classId, see: see });
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

exports.dataForActions = {
    twoBring: function() {
        var signUpInfo = this.bindings.signUpInfo.data;
        if (signUpInfo.usingTwoBrings === 1) {
            return true;
        }
        this.app.message.error('该班级没有启用两个带来');
        return false;
    }
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
