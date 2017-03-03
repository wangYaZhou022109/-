var D = require('drizzlejs'),
    helpers = require('./app/util/helpers');

exports.items = {
    offline: 'offline',
    online: 'online',
    questionnaire: 'questionnaire',
    configOffline: '',
    configOnline: '',
    editOffline: '',
    upload: '',
    courseware: '',
    'train/programme/select-course': { isModule: true }
};

exports.store = {
    models: {
        classInfo: { url: '../train/classInfo/single' },
        offlineCourseList: { url: '../train/offline-course' },
        onlineCourseList: { url: '../train/online-course' },
        onlineCourse: { url: '../train/online-course' },
        questionnaireList: { url: '../train/questionnaire' },
        themeList: { url: '../train/theme' },
        offlineThemeList: { url: '../train/theme/findOfflineTheme' },
        themeModel: { url: '../train/theme' },
        offlineCourse: { url: '../train/offline-course' },
        classroomList: { url: '../train/config-classroom/findList', params: { type: 6 }, autoLoad: 'after' },
        file: { url: '../human/file/upload-parse-file' },
        attachList: { url: '../train/offline-course/findAttach' },
        courseAttach: { url: '../train/course-attach' },
        download: { url: '../human/file/download' },
        delThemeList: { data: [] },
        state: { data: {} },
        files: { data: [] },
        weeks: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var offlineCourseList = this.models.offlineCourseList,
                onlineCourseList = this.models.onlineCourseList,
                questionnaireList = this.models.questionnaireList,
                classInfo = this.models.classInfo,
                offlineThemeList = this.models.offlineThemeList,
                state = this.models.state,
                weeks = this.models.weeks,
                me = this;
            classInfo.set(payload);
            this.get(classInfo).then(function(data) {
                offlineThemeList.params.classId = data[0].id;
                me.get(offlineThemeList).then(function(list) {
                    weeks.data = list[0];
                    weeks.changed();
                    if (weeks.data.length > 1) {
                        offlineCourseList.params.startDate = weeks.data[0].startDate;
                        offlineCourseList.params.endDate = weeks.data[0].endDate;
                    }
                    offlineCourseList.params.classId = data[0].id;
                    me.get(offlineCourseList);
                });
                state.data.classId = data[0].id;
                onlineCourseList.params.classId = data[0].id;
                me.get(onlineCourseList);
                questionnaireList.params.classId = data[0].id;
                me.get(questionnaireList);
            });
        },
        showOnlineTheme: function() {
            var themeList = this.models.themeList,
                state = this.models.state,
                me = this;
            themeList.params.classId = state.data.classId;
            themeList.params.type = 2;
            me.get(themeList);
        },
        delTheme: function(id) {
            var themeList = this.models.themeList.data,
                delThemeList = this.models.delThemeList.data,
                index,
                delTheme = {};
            index = themeList.findIndex(function(e) {
                return e.id === id;
            });
            themeList.splice(index, 1);
            this.models.themeList.changed();
            delTheme.id = id;
            delThemeList.push(delTheme);
        },
        moveUp: function(id) {
            var themeList = this.models.themeList.data,
                target,
                index,
                sort;
            index = themeList.findIndex(function(e) {
                return e.id === id;
            });
            if (index <= 0) {
                return;
            }
            target = themeList[index];
            sort = themeList[index - 1].sort;
            themeList[index] = themeList[index - 1];
            themeList[index].sort = target.sort;
            themeList[index - 1] = target;
            themeList[index - 1].sort = sort;
            this.models.themeList.changed();
        },
        moveDown: function(id) {
            var themeList = this.models.themeList.data,
                target,
                index,
                sort;
            index = themeList.findIndex(function(e) {
                return e.id === id;
            });
            if (index >= themeList.length - 1) {
                return;
            }
            target = themeList[index];
            sort = themeList[index + 1].sort;
            themeList[index] = themeList[index + 1];
            themeList[index].sort = target.sort;
            themeList[index + 1] = target;
            themeList[index + 1].sort = sort;
            this.models.themeList.changed();
        },
        updateName: function(data) {
            var themeList = this.models.themeList.data,
                target,
                index;
            index = themeList.findIndex(function(e) {
                return e.id === data.id;
            });
            target = themeList[index];
            target.name = data.name;
            this.models.themeList.changed();
        },
        addTheme: function(data) {
            var themeList = this.models.themeList.data,
                state = this.models.state,
                newTheme = {},
                index;
            index = state.data.index || themeList.length;
            index++;
            newTheme.id = 'new-' + index;
            newTheme.classId = state.data.classId;
            newTheme.type = 2;
            newTheme.name = data;
            newTheme.sort = index;
            themeList.push(newTheme);
            this.models.themeList.changed();
            state.data.index = index;
            state.changed();
        },
        saveTheme: function() {
            var themeList = this.models.themeList,
                state = this.models.state.data,
                delThemeList = this.models.delThemeList,
                themeModel = this.models.themeModel,
                me = this;
            themeModel.clear();
            D.assign(me.models.themeModel.data, {
                newThemeList: JSON.stringify(themeList.data),
                delThemeList: JSON.stringify(delThemeList.data),
                classId: state.classId,
                type: 2
            });
            return me.save(me.models.themeModel);
        },
        submitOffline: function(payload) {
            var offlineCourse = this.models.offlineCourse,
                offlineCourseList = this.models.offlineCourseList,
                state = this.models.state,
                fileList = this.models.files,
                me = this,
                courseDate;
            courseDate = payload.courseDate.split(' ');
            offlineCourse.set(payload);
            offlineCourse.data.id = payload.id[0];
            offlineCourse.data.classId = state.data.classId;
            D.assign(me.models.offlineCourse.data, {
                fileList: JSON.stringify(fileList.data)
            });
            offlineCourse.data.courseDate = courseDate[0];
            offlineCourse.data.startTime = courseDate[1];
            this.save(offlineCourse).then(function() {
                this.app.message.success('提交成功');
                me.get(offlineCourseList);
            });
        },
        editOfflineCourse: function(payload) {
            var model = this.models.offlineCourse,
                files = this.models.files;
            model.set(payload);
            files.clear();
            this.get(model).then(function(data) {
                var d = data;
                files.data = d[0].attachList;
                files.changed();
                d[0].courseDate = helpers.date(d[0].courseDate) + ' ' + d[0].startTime;
            });
        },
        delOfflineCourse: function(payload) {
            var model = this.models.offlineCourse,
                offlineCourseList = this.models.offlineCourseList,
                me = this;
            model.set(payload);
            this.del(model).then(function() {
                me.get(offlineCourseList);
            });
        },
        uploadFile: function(payload) {
            var img = payload[0],
                files = this.models.files.data || [],
                courseAttach = this.models.courseAttach,
                newFile = {},
                state = this.models.state.data,
                me = this;
            newFile.id = img.attachmentId;
            newFile.attachId = img.attachmentId;
            newFile.attachType = img.contentType;
            newFile.attachName = img.name;
            newFile.extension = img.extension;
            if (state.uploadType) {
                courseAttach.clear();
                courseAttach.data.courseId = state.courseId;
                courseAttach.data.attachId = img.attachmentId;
                courseAttach.data.attachType = img.contentType;
                courseAttach.data.attachName = img.name;
                this.save(courseAttach).then(function(data) {
                    newFile.id = data[0].id;
                    files.push(newFile);
                    me.models.files.changed();
                });
            } else {
                files.push(newFile);
                this.models.files.changed();
            }
        },
        delAttach: function(payload) {
            var files = this.models.files.data,
                state = this.models.state.data,
                courseAttach = this.models.courseAttach,
                index;
            index = files.findIndex(function(e) {
                return e.id === payload.id;
            });
            files.splice(index, 1);
            this.models.files.changed();
            if (state.delType) {
                courseAttach.set(payload);
                this.del(courseAttach);
            }
        },
        showCourseware: function(payload) {
            var model = this.models.attachList,
                files = this.models.files,
                state = this.models.state;
            model.set(payload);
            files.clear();
            state.data.courseId = payload.id;
            this.get(model).then(function(data) {
                var d = data;
                files.data = d[0];
                files.changed();
            });
        },
        updateAttachName: function(data) {
            var files = this.models.files.data,
                state = this.models.state.data,
                courseAttach = this.models.courseAttach,
                target,
                index;
            index = files.findIndex(function(e) {
                return e.id === data.id;
            });
            target = files[index];
            target.attachName = data.attachName;
            this.models.files.changed();
            if (state.updateType) {
                courseAttach.clear();
                courseAttach.set(data);
                this.save(courseAttach);
            }
        },
        updateOThemeName: function(data) {
            var weeks = this.models.weeks.data,
                target,
                index;
            index = weeks.findIndex(function(e) {
                return e.id === data.id;
            });
            target = weeks[index];
            target.name = data.name;
            this.models.weeks.changed();
        },
        saveOfflineTheme: function() {
            var weeks = this.models.weeks,
                state = this.models.state.data,
                themeModel = this.models.themeModel,
                me = this;
            themeModel.clear();
            D.assign(me.models.themeModel.data, {
                newThemeList: JSON.stringify(weeks.data),
                delThemeList: JSON.stringify([]),
                classId: state.classId,
                type: 1
            });
            return me.save(me.models.themeModel).then(function() {
                me.models.offlineThemeList.data = weeks.data;
                me.models.offlineThemeList.changed();
            });
        },
        searchOffline: function(payload) {
            var weeks = this.models.weeks.data,
                offlineCourseList = this.models.offlineCourseList,
                index,
                target;
            index = weeks.findIndex(function(e) {
                return e.id === payload.id;
            });
            target = weeks[index];
            offlineCourseList.params.startDate = target.startDate;
            offlineCourseList.params.endDate = target.endDate;
            this.get(offlineCourseList);
        },
        saveOnlineCourse: function(data) {
            var target = data.target,
                delList = data.del,
                themeId = data.themeId,
                onlineCourse = this.models.onlineCourse,
                onlineCourseList = this.models.onlineCourseList,
                state = this.models.state.data,
                me = this;
            onlineCourse.clear();
            D.assign(onlineCourse.data, {
                classId: state.classId,
                themeId: themeId,
                courseList: JSON.stringify(target),
                delList: JSON.stringify(delList)
            });
            this.save(onlineCourse).then(function() {
                this.app.message.success('提交成功');
                me.get(onlineCourseList);
            });
        },
        delOnlineCourse: function(payload) {
            var model = this.models.onlineCourse,
                onlineCourseList = this.models.onlineCourseList,
                me = this;
            model.set(payload);
            this.del(model).then(function() {
                me.get(onlineCourseList);
            });
        },
        updateRequired: function() {

        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id });
};
