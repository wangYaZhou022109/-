var D = require('drizzlejs');

exports.items = {
    offline: 'offline',
    online: 'online',
    questionnaire: 'questionnaire',
    configOffline: '',
    configOnline: '',
    editOffline: ''
};

exports.store = {
    models: {
        classInfo: { url: '../train/classInfo/single' },
        offlineCourseList: { url: '../train/offline-course' },
        onlineCourseList: { url: '../train/online-course' },
        questionnaireList: { url: '../train/questionnaire' },
        themeList: { url: '../train/theme' },
        themeModel: { url: '../train/theme' },
        offlineCourse: { url: '../train/offline-course' },
        classroomList: { url: '../train/config-classroom/findList', params: { type: 6 }, autoLoad: 'after' },
        delThemeList: { data: [] },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var offlineCourseList = this.models.offlineCourseList,
                onlineCourseList = this.models.onlineCourseList,
                questionnaireList = this.models.questionnaireList,
                classInfo = this.models.classInfo,
                state = this.models.state,
                me = this;
            classInfo.set(payload);
            this.get(classInfo).then(function(data) {
                state.data.classId = data[0].id;
                offlineCourseList.params.classId = data[0].id;
                me.get(offlineCourseList);
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
            newTheme.id = index + '';
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
                me = this;
            offlineCourse.set(payload);
            offlineCourse.data.classId = state.data.classId;
            this.save(offlineCourse).then(function() {
                this.app.message.success('提交成功');
                me.get(offlineCourseList);
            });
        },
        editOfflineCourse: function(payload) {
            var model = this.models.offlineCourse;
            model.set(payload);
            this.get(model);
        },
        delOfflineCourse: function(payload) {
            var model = this.models.offlineCourse,
                offlineCourseList = this.models.offlineCourseList,
                me = this;
            model.set(payload);
            this.del(model).then(function() {
                me.get(offlineCourseList);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id });
};
