exports.items = {
    main: 'main',
    upload: ''
};

exports.store = {
    models: {
        classInfo: { url: '../train/class-info/find-by-project-id' },
        saveModel: { url: '../train/class-info' },
        offlineCourse: { url: '../train/offline-course/init' },
        manyi: { url: '../train/questionnaire-survey/insert' },
        file: {
            url: '../human/file/upload'
        },
        down: { url: '../human/file/download' },
        classroomList: { url: '../train/config-classroom/findList', params: { type: 6 }, autoLoad: 'after' },
        quota: { url: '../train/class-quota/init' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var classInfo = this.models.classInfo,
                me = this;
            classInfo.set(payload);
            return me.get(classInfo);
        },
        submit: function(payload) {
            var model = this.models.saveModel,
                classInfo = this.models.classInfo,
                offlineCourse = this.models.offlineCourse,
                quota = this.models.quota,
                manyi = this.models.manyi,
                newManYi = {},
                me = this;
            newManYi.type = 4;
            newManYi.classId = classInfo.data.classDetail.classId;
            newManYi.resourceName = '满意度调查问卷（学员）';
            newManYi.startTime = classInfo.data.returnDate;
            manyi.set(newManYi);
            model.set(payload);
            model.data.confirm = 1;
            offlineCourse.data.classId = classInfo.data.id;
            quota.data.classId = classInfo.data.id;
            me.save(model).then(function() {
                this.app.message.success('提交成功');
                me.get(classInfo);
                me.save(offlineCourse);
                me.save(manyi);
                me.save(quota);
            });
        },
        save: function(payload) {
            var model = this.models.saveModel,
                classInfo = this.models.classInfo,
                me = this;
            model.set(payload);
            me.save(model).then(function() {
                this.app.message.success('保存成功');
                me.get(classInfo);
            });
        },
        addCoverFile: function(payload) {
            var img = payload[0],
                state = this.models.state,
                down = this.models.down;
            state.data.downUrl = down.getFullUrl() + '?id=' + img.attachmentId;
            state.data.attachmentId = img.attachmentId;
            state.changed();
        },
        addBannerFile: function(payload) {
            var img = payload[0],
                state = this.models.state,
                down = this.models.down;
            state.data.bannerUrl = down.getFullUrl() + '?id=' + img.attachmentId;
            state.data.bannerId = img.attachmentId;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.id });
};
