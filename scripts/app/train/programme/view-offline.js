var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    offlineCourseList: true,
    state: false,
    offlineCourse: false,
    offlineThemeList: true,
    export: false,
    files: false
};

exports.events = {
    'click addOfflineCourse': 'addOfflineCourse',
    'click theme-offline': 'showOfflineTheme',
    'click label-name-offline-*': 'changeOfflineName',
    'change input-name-offline-*': 'updateOfflineName',
    'click label-teacher-offline-*': 'changeTeacherName',
    'change input-teacher-offline-*': 'updateTeacherName',
    'click label-torg-offline-*': 'changeTorgName',
    'change input-torg-offline-*': 'updateTorgName',
    // 'click label-title-offline-*': 'changeTitleName',
    // 'change input-title-offline-*': 'updateTitleName',
    'click label-paidPay-offline-*': 'changePay',
    'change input-paidPay-offline-*': 'updatePay',
    'click importOffline': 'importCourse',
    'click minimize-*': 'showMinimize'
};

exports.handlers = {
    addOfflineCourse: function() {
        var model = this.module.items['edit-offline'],
            files = this.bindings.files,
            offlineCourse = this.bindings.offlineCourse;
        this.bindings.state.data.type = 'add';
        offlineCourse.clear();
        files.clear();
        this.app.viewport.modal(model);
    },
    showOfflineTheme: function() {
        this.app.viewport.modal(this.module.items['config-offline']);
    },
    changeOfflineName: function(id) {
        $(this.$('input-name-offline-' + id)).css('display', 'block');
        $(this.$('label-name-offline-' + id)).css('display', 'none');
        // this.$('input-name-offline-' + id).addEvent('blur', 'updateOfflineName');
    },
    updateOfflineName: function(id) {
        var val = $(this.$('input-name-offline-' + id)).val();
        if (val === '') {
            this.app.message.alert('课程名称不能为空');
        } else {
            this.module.dispatch('updateOfflineName', { id: id, name: val });
        }
    },
    changeTeacherName: function(id) {
        $(this.$('input-teacher-offline-' + id)).css('display', 'block');
        $(this.$('label-teacher-offline-' + id)).css('display', 'none');
    },
    updateTeacherName: function(id) {
        var val = $(this.$('input-teacher-offline-' + id)).val();
        if (val === '') {
            this.app.message.alert('讲师名称不能为空');
        } else {
            this.module.dispatch('updateOfflineName', { id: id, teacherName: val });
        }
    },
    changeTorgName: function(id) {
        $(this.$('input-torg-offline-' + id)).css('display', 'block');
        $(this.$('label-torg-offline-' + id)).css('display', 'none');
    },
    updateTorgName: function(id) {
        var val = $(this.$('input-torg-offline-' + id)).val();
        if (val === '') {
            this.app.message.alert('讲师单位不能为空');
        } else {
            this.module.dispatch('updateOfflineName', { id: id, teacherOrganization: val });
        }
    },
    // changeTitleNamechangeTitleName: function(id) {
    //     $(this.$('input-title-offline-' + id)).css('display', 'block');
    //     $(this.$('label-title-offline-' + id)).css('display', 'none');
    // },
    // updateTitleName: function(id) {
    //     var val = $(this.$('input-title-offline-' + id)).val();
    //     if (val === '') {
    //         this.app.message.alert('讲师职称不能为空');
    //     } else {
    //         this.module.dispatch('updateOfflineName', { id: id, teacherTitle: val });
    //     }
    // },
    changePay: function(id) {
        $(this.$('input-paidPay-offline-' + id)).css('display', 'block');
        $(this.$('label-paidPay-offline-' + id)).css('display', 'none');
    },
    updatePay: function(id) {
        var val = $(this.$('input-paidPay-offline-' + id)).val(),
            reg = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
        if (val === '' || !reg.test(val)) {
            this.app.message.alert('课酬实付不能为空并且为数字');
        } else {
            this.module.dispatch('updatePay', { courseId: id, paidPay: val });
        }
    },
    importCourse: function() {
        this.app.viewport.modal(this.module.items.import);
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
        this.app.viewport.modal(this.module.items['edit-offline']);
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
    offlineCourseList: function() {
        var offlineCourseList = this.bindings.offlineCourseList.data,
            state = this.bindings.state.data,
            themes,
            tmpThemeId = 0;
        themes = _.groupBy(offlineCourseList, 'courseDate');
        _.map(offlineCourseList || [], function(data) {
            var r = data;
            r.isGrant = state.role !== 4;
            if (tmpThemeId !== r.courseDate) {
                tmpThemeId = r.courseDate;
                r.isRowspan = true;
                r.rowspan = themes[r.courseDate].length;
            }
        });
        return offlineCourseList;
    },
    isShowWeeks: function() {
        var weeks = this.bindings.offlineThemeList;
        if (weeks.data.length > 1) {
            return true;
        }
        return false;
    },
    downUrl: function() {
        var model = this.bindings.export,
            state = this.bindings.state.data,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('classId=' + state.classId);
        url += ('&access_token=' + token);
        return url;
    },
    isGrant: function() {
        var state = this.bindings.state.data;
        if (state.role !== 4) {
            return true;
        }
        return false;
    }
};

// exports.mixin = {
//     addEvent: function(el, event, fn) {
//         console.log(this);
//         if (el.addEventListener) {
//             el.addEventListener(event, fn, false);
//         }
//         el.attachEvent('on' + event, fn);
//     }
// };
