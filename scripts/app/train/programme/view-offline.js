var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    offlineCourseList: true,
    state: false,
    offlineCourse: false,
    offlineThemeList: true
};

exports.events = {
    'click addOfflineCourse': 'addOfflineCourse',
    'click theme-offline': 'showOfflineTheme'
};

exports.handlers = {
    addOfflineCourse: function() {
        this.bindings.state.data.type = 'add';
        this.bindings.offlineCourse.clear();
        this.app.viewport.modal(this.module.items.editOffline);
    },
    showOfflineTheme: function() {
        this.app.viewport.modal(this.module.items.configOffline);
    }
};

exports.actions = {
    'click edit-offline-*': 'editOfflineCourse',
    'click del-offline-*': 'delOfflineCourse',
    'click courseware-*': 'showCourseware',
    'change selectOffline': 'searchOffline'
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
    },
    searchOffline: function() {
        var val = $(this.$('selectOffline')).val();
        return { id: val };
    }
};

exports.actionCallbacks = {
    editOfflineCourse: function() {
        this.app.viewport.modal(this.module.items.editOffline);
    },
    showCourseware: function() {
        this.app.viewport.modal(this.module.items.courseware);
    }
};

exports.dataForTemplate = {
    weeks: function() {
        var weeks = this.bindings.offlineThemeList,
            offlineCourseList = this.bindings.offlineCourseList,
            startDate,
            endDate;
        startDate = offlineCourseList.params.startDate;
        endDate = offlineCourseList.params.endDate;
        _.map(weeks.data || [], function(data) {
            var r = data;
            r.checked = r.startDate === startDate && r.endDate === endDate;
        });
        return weeks.data;
    },
    isShowWeeks: function() {
        var weeks = this.bindings.offlineThemeList;
        if (weeks.data.length > 1) {
            return true;
        }
        return false;
    }
};
