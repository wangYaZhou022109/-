var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    onlineCourseList: true,
    state: true
};

exports.actions = {
    'click theme-online': 'showOnlineTheme',
    'click del-online-*': 'delOnlineCourse'
};

exports.dataForActions = {
    delOnlineCourse: function(payload) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此课程吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('delOnlineCourse', payload);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    showOnlineTheme: function() {
        this.app.viewport.modal(this.module.items.configOnline);
    }
};

exports.dataForTemplate = {
    state: function() {
        var state = this.bindings.state.data;
        return state;
    },
    onlineCourseList: function() {
        var onlineCourseList = this.bindings.onlineCourseList;
        _.map(onlineCourseList.data || [], function(course) {
            var r = course;
            r.isRequired1 = r.isRequired === 1;
            r.isRequired0 = r.isRequired === 0;
        });
        return onlineCourseList.data;
    }
};

exports.events = {
    'click addCourse': 'addCourse',
    'click label-online-*': 'changeRequired',
    'change input-online-*': 'updateRequired',
    'click minimize-*': 'showMinimize',
    'click view-online-*': 'viewCourse'
};

exports.handlers = {
    addCourse: function() {
        var model = this.module.items['train/programme/select-course'],
            state = this.bindings.state,
            me = this;
        me.app.viewport.modal(model, {
            id: state.data.classId,
            callback: function(themeId, target, del) {
                me.module.dispatch('saveOnlineCourse', { themeId: themeId, target: target, del: del });
            }
        });
    },
    changeRequired: function(id) {
        $(this.$('input-online-' + id)).css('display', 'block');
        $(this.$('label-online-' + id)).css('display', 'none');
    },
    updateRequired: function(id) {
        var val = this.$('input-online-' + id).value;
        this.module.dispatch('updateRequired', { id: id, isRequired: val });
    },
    showMinimize: function(id) {
        $(this.$('minitable-' + id)).toggle();
        if ($(this.$('min-' + id)).text() === '最小化') {
            $(this.$('min-' + id)).text('最大化');
            $(this.$('minimize-' + id)).addClass('icon-add-full').removeClass('icon-minus-full');
        } else {
            $(this.$('min-' + id)).text('最小化');
            $(this.$('minimize-' + id)).addClass('icon-minus-full').removeClass('icon-add-full');
        }
    },
    viewCourse: function(id) {
        window.open('#/study/course/detail/' + id, '_blank');
    }
};
