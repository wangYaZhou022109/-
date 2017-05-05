var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');

exports.items = {
    offline: 'offline',
    online: 'online',
    questionnaire: 'questionnaire',
    task: 'task',
    'config-offline': '',
    'config-online': '',
    'edit-offline': '',
    'edit-task': '',
    upload: '',
    'upload-task': '',
    courseware: '',
    'train/programme/select-course': { isModule: true },
    'train/programme/select-member': { isModule: true },
    'train/programme/select-research-activity': { isModule: true },
    'train/programme/evaluate-questionary/select-evaluate-questionary': { isModule: true },
    import: '',
    'import-upload': '',
    'train/programme/exam/other-module-exam': { isModule: true },
    'edit-qnrtime': '',
    'train/programme/research-activity/add-research-third-party': { isModule: true },
    'train/programme/evaluate-questionary/select-evaluate-questionary/add-research-refrence': { isModule: true },
    'train/programme/exam/paper/preview-paper': { isModule: true },
    'train/programme/research-activity/preview-questionary': { isModule: true }
};

exports.store = {
    models: {
        classInfo: { url: '../train/class-info/single' },
        offlineCourseList: { url: '../train/offline-course' },
        onlineCourseList: { url: '../train/online-course' },
        onlineCourse: { url: '../train/online-course' },
        questionnaireList: { url: '../train/questionnaire' },
        research: { url: '../train/questionnaire' },
        taskList: { url: '../train/class-task' },
        task: { url: '../train/class-task' },
        themeList: { url: '../train/theme' },
        offlineThemeList: { url: '../train/theme/findOfflineTheme' },
        themeModel: { url: '../train/theme' },
        offlineCourse: { url: '../train/offline-course' },
        classroomList: { url: '../train/config-classroom/findList', params: { type: 6 }, autoLoad: 'after' },
        file: { url: '../human/file/upload-parse-file' },
        importFile: { url: '../human/file/upload-file' },
        attachList: { url: '../train/offline-course/findAttach' },
        courseAttach: { url: '../train/course-attach' },
        taskAttach: { url: '../train/task-attach' },
        download: { url: '../human/file/download' },
        offlineClickUpdate: { url: '../train/offline-course/click-update' },
        courseSalary: { url: '../train/courseSalary/updateByCourseId' },
        import: { url: '../train/offline-course/import' },
        export: { url: '../train/offline-course/exportData' },
        fileInfo: {},
        importInfo: {},
        downExcel: { url: '../train/offline-course/download-excel' },
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
                taskList = this.models.taskList,
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
                taskList.params.classId = data[0].id;
                me.get(taskList);
            });
        },
        showOnlineTheme: function() {
            var themeList = this.models.themeList,
                state = this.models.state,
                me = this;
            themeList.params.classId = state.data.classId;
            themeList.params.type = 2;
            return me.get(themeList);
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
            D.assign(payload, {
                fileList: JSON.stringify(fileList.data),
                id: fileList.data.length > 0 ? payload.id[0] : payload.id,
                classId: state.data.classId,
                courseDate: courseDate[0],
                startTime: courseDate[1]
            });
            offlineCourse.clear();
            offlineCourse.set(payload);
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
            model.params.id = payload.id;
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
        updateRequired: function(payload) {
            var model = this.models.onlineCourse,
                onlineCourseList = this.models.onlineCourseList,
                me = this;
            model.set(payload);
            this.save(model).then(function() {
                me.get(onlineCourseList);
            });
        },
        updateOfflineName: function(payload) {
            var model = this.models.offlineClickUpdate,
                offlineCourseList = this.models.offlineCourseList,
                me = this;
            model.clear();
            model.set(payload);
            this.save(model).then(function() {
                me.get(offlineCourseList);
            });
        },
        updatePay: function(payload) {
            var model = this.models.courseSalary,
                offlineCourseList = this.models.offlineCourseList,
                me = this;
            model.clear();
            model.set(payload);
            this.save(model).then(function() {
                me.get(offlineCourseList);
            });
        },
        importFile: function(payload) {
            var me = this,
                importData = me.models.import,
                state = me.models.importInfo;
            importData.set(payload);
            me.save(importData).then(function(data) {
                state.data = data[0];
                state.data.imported = true;
                if (state.data.failureCount > 0) {
                    state.data.error = true;
                }
                state.changed();
                me.get(me.models.offlineCourseList);
            });
        },
        delTask: function(payload) {
            var model = this.models.task,
                taskList = this.models.taskList,
                me = this;
            model.set(payload);
            this.del(model).then(function() {
                me.get(taskList);
            });
        },
        editTask: function(payload) {
            var model = this.models.task,
                files = this.models.files;
            model.set(payload);
            files.clear();
            this.get(model).then(function(data) {
                var d = data;
                files.data = d[0].attachList;
                files.changed();
            });
        },
        saveTask: function(payload) {
            var task = this.models.task,
                taskList = this.models.taskList,
                state = this.models.state,
                fileList = this.models.files,
                startTime = payload.startTime,
                endTime = payload.endTime,
                me = this;
            D.assign(payload, {
                fileList: JSON.stringify(fileList.data),
                id: fileList.data.length > 0 ? payload.id[0] : payload.id,
                classId: state.data.classId,
            });
            task.clear();
            task.set(payload);
            if (startTime >= endTime) {
                this.app.message.alert('结束时间必须大于开始时间');
            } else {
                this.save(task).then(function() {
                    this.app.message.success('提交成功');
                    this.app.viewport.closeModal();
                    me.get(taskList);
                });
            }
        },
        uploadTaskFile: function(payload) {
            var img = payload[0],
                files = this.models.files.data || [],
                taskAttach = this.models.taskAttach,
                newFile = {},
                state = this.models.state.data,
                me = this;
            newFile.id = img.attachmentId;
            newFile.attachmentId = img.attachmentId;
            newFile.attachmentType = img.contentType;
            newFile.attachmentName = img.name;
            newFile.extension = img.extension;
            if (state.uploadType) {
                taskAttach.clear();
                taskAttach.data.taskId = state.taskId;
                taskAttach.data.attachmentId = img.attachmentId;
                taskAttach.data.attachmentType = img.contentType;
                taskAttach.data.attachmentName = img.name;
                this.save(taskAttach).then(function(data) {
                    newFile.id = data[0].id;
                    files.push(newFile);
                    me.models.files.changed();
                });
            } else {
                files.push(newFile);
                this.models.files.changed();
            }
        },
        delTaskAttach: function(payload) {
            var files = this.models.files.data,
                state = this.models.state.data,
                taskAttach = this.models.taskAttach,
                index;
            index = files.findIndex(function(e) {
                return e.id === payload.id;
            });
            files.splice(index, 1);
            this.models.files.changed();
            if (state.delType) {
                taskAttach.set(payload);
                this.del(taskAttach);
            }
        },
        updateTaskAttachName: function(data) {
            var files = this.models.files.data,
                state = this.models.state.data,
                taskAttach = this.models.taskAttach,
                target,
                index;
            index = files.findIndex(function(e) {
                return e.id === data.id;
            });
            target = files[index];
            target.attachmentName = data.attachmentName;
            this.models.files.changed();
            if (state.updateType) {
                taskAttach.clear();
                taskAttach.set(data);
                this.save(taskAttach);
            }
        },
        saveResearch: function(payload) {
            var questionnaireList = this.models.questionnaireList,
                research = this.models.research,
                state = this.models.state.data,
                me = this,
                questionary;
            D.assign(payload, {
                classId: state.classId
            });
            questionary = _.find(questionnaireList.data, {
                resourceId: payload.resourceId,
                classId: payload.classId
            });
            if (questionary) {
                questionnaireList.params.classId = state.classId;
                me.get(questionnaireList);
            } else {
                research.set(payload);
                this.save(research).then(function() {
                    questionnaireList.params.classId = state.classId;
                    me.get(questionnaireList);
                });
            }
        },
        delQuestionnair: function(payload) {
            var research = this.models.research,
                questionnaireList = this.models.questionnaireList,
                state = this.models.state.data,
                me = this;
            research.set(payload);
            this.del(research).then(function() {
                questionnaireList.params.classId = state.classId;
                me.get(questionnaireList);
            });
        },
        toEdit: function(payload) {
            var research = this.models.research;
            research.clear();
            research.set(payload);
            return this.get(research);
        },
        editQuestionnair: function(payload) {
            var questionnaireList = this.models.questionnaireList,
                research = this.models.research,
                me = this;
            research.clear();
            research.set(payload.data);
            me.put(research).then(function() {
                me.app.message.success('操作成功');
                me.get(questionnaireList);
            });
        },
        editTime: function(payload) {
            var research = this.models.research,
                me = this;
            research.clear();
            research.set(payload);
            me.put(research).then(function() {
                me.app.message.success('操作成功');
                me.get(me.models.questionnaireList);
            });
        },
        addCourse: function() {
            var themeList = this.models.themeList,
                state = this.models.state,
                me = this;
            themeList.params.classId = state.data.classId;
            themeList.params.type = 2;
            return me.get(themeList);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id });
};
