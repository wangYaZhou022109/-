exports.items = {
    pdf: 'pdf'
};

exports.store = {
    models: {
        updateProgress: { url: '../course-study/course-front/doc-progress' },
        download: { url: '../human/file/preview' },
        time: { url: '../system/setting/time' },
        state: {},
        localProgress: { type: 'localStorage', data: {} },
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                time = this.models.time,
                localProgress = this.models.localProgress,
                localTemp;
            state.set(payload);
            if (localProgress.data && localProgress.data[payload.section.id]) {
                localTemp = localProgress.data[payload.section.id];
                state.data.localLocation = localTemp.lessonLocation;
            }
            return this.get(time);
        },
        updatePregress: function(payload) {
            var updateProgress = this.models.updateProgress,
                localProgress = this.models.localProgress;
            updateProgress.set(payload);
            delete localProgress.data[payload.sectionId];
            localProgress.save();
            return this.save(updateProgress);
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
