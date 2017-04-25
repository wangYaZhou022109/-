exports.items = {
    video: 'video'
};

exports.store = {
    models: {
        // 音视频更新进度
        updateProgress: { url: '../course-study/course-front/video-progress' },
        attachment: { url: '../human/file' },
        download: { url: '../human/file/download' },
        time: { url: '../system/setting/time' },
        localProgress: { type: 'localStorage', data: {} },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                time = this.models.time,
                localProgress = this.models.localProgress,
                localTemp;
            localProgress.load();
            state.set(payload);
            if (localProgress.data && localProgress.data[payload.section.id]) {
                localTemp = localProgress.data[payload.section.id];
                state.data.localTime = localTemp.studyTime || 0;
                state.data.localLocation = localTemp.lessonLocation;
            }
            return this.chain([
                this.get(time),
                function() {
                    this.models.attachment.set({ id: payload.section.resourceId });
                    return this.get(this.models.attachment);
                }
            ]);
        },
        updateProgress: function(payload) {
            var model = this.models.updateProgress,
                localProgress = this.models.localProgress;
            model.set(payload);
            delete localProgress.data[payload.sectionId];
            localProgress.save();
            return this.post(model);
        },
        storeProcess: function(payload) {
            var localProgress = this.models.localProgress;
            var mapData = localProgress.data || {};
            mapData[payload.sectionId] = payload;
            localProgress.set(mapData);
            localProgress.save();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
