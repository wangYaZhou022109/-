exports.items = {
    main: 'main',
    upload: ''
};

exports.store = {
    models: {
        classInfo: { url: '../train/classInfo/findByProjectId' },
        saveModel: { url: '../train/classInfo' },
        offlineCourse: { url: '../train/offline-course/init' },
        file: {
            url: '../human/file/upload'
        },
        down: { url: '../human/file/download' },
        classroomList: { url: '../train/config-classroom/findList', params: { type: 6 }, autoLoad: 'after' },
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
                me = this;
            model.set(payload);
            model.data.confirm = 1;
            offlineCourse.data.classId = classInfo.data.id;
            me.save(model).then(function() {
                this.app.message.success('提交成功');
                me.get(classInfo);
                me.save(offlineCourse);
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
