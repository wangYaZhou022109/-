exports.bindings = {
    offlineCourseList: true,
    state: false,
    offlineCourse: false
};

exports.events = {
    'click addOfflineCourse': 'addOfflineCourse'
};

exports.handlers = {
    addOfflineCourse: function() {
        this.bindings.state.data.type = 'add';
        this.bindings.offlineCourse.clear();
        this.app.viewport.modal(this.module.items.editOffline);
    }
};

exports.actions = {
    'click edit-offline-*': 'editOfflineCourse',
    'click del-offline-*': 'delOfflineCourse'
};

exports.dataForActions = {
    editOfflineCourse: function(data) {
        this.bindings.state.data.type = 'update';
        return data;
    },
    delOfflineCourse: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此课程吗?';
            me.app.message.confirm(message, function() {
                resolve(id);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    showOnlineTheme: function() {
        this.app.viewport.modal(this.module.items.configOnline);
    },
    editOfflineCourse: function() {
        this.app.viewport.modal(this.module.items.editOffline);
    }
};
