exports.items = {
    audio: 'audio'
};

exports.store = {
    models: {
        updateProgress: { url: '../course-study/course-front/video-progress' },
        download: { url: '../human/file/download' },
        time: { url: '../system/setting/time' },
        state: {},
        localProgress: { type: 'localStorage' },
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
            return this.get(time);
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
    this.dispatch('init', this.renderOptions);
};
