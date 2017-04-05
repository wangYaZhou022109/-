var timeInterval;
exports.bindings = {
    state: false,
    download: false,
    time: false
};

exports.components = [
    function() {
        var section = this.bindings.state.data.section,
            download = this.bindings.download,
            url;
        url = download.getFullUrl() + '?id=' + section.resourceId;
        return {
            id: 'waveform',
            name: 'audio-waveform',
            options: {
                url: url,
                opt: {
                    height: 400,
                    barWidth: 2,
                    cursorWidth: 0,
                }
            }
        };
    }
];

exports.events = {
    'click playPause': 'playPause',
};

exports.handlers = {
    playPause: function() {
        this.components.waveform.playPause();
    }
};

exports.beforeClose = function() {
    var me = this,
        state = this.bindings.state.data,
        sectionId = state.section.id,
        localTime = state.localTime || 0,
        beginTime = me.bindings.time.data,
        studyTime = this.components.waveform.getLearnTime() + localTime,
        totalTime = this.components.waveform.getDuration(),
        lessonLocation = this.components.waveform.getCurrentTime();
    var callback = this.module.renderOptions.callback;
    clearInterval(timeInterval);
    me.module.dispatch('updateProgress', {
        beginTime: beginTime,
        studyTime: Math.ceil(studyTime),
        resourceTotalTime: Math.ceil(totalTime),
        lessonLocation: Math.ceil(lessonLocation),
        clientType: 0,
        sectionId: sectionId
    }).then(function(data) { callback(data); });
};

// 支持的事件 loading,ready,play,pause,finish,error
exports.audio = {
    loading: function(value) {
        this.$('progress').value = value;
    },
    ready: function() {
        var state = this.bindings.state.data;
        var localLocation = state.localLocation;
        var currentTime = 0;
        this.$('progress').hidden = true;
        if (state.progress) currentTime = state.progress.lessonLocation;
        if (localLocation) currentTime = Math.floor(localLocation);
        if (Number(currentTime) < 0) currentTime = 0;
        this.components.waveform.play(Number(currentTime));
    }
};
exports.afterRender = function() {
    // 每分钟保存进度, lessonLocation,studyTime,sectionId
    var player = this.components.waveform,
        sectionId = this.bindings.state.data.section.id,
        me = this;
    var process = function() {
        return {
            lessonLocation: player.getCurrentTime(),
            studyTime: player.getLearnTime(),
            sectionId: sectionId
        };
    };
    timeInterval = setInterval(function() {
        me.module.dispatch('storeProcess', process());
    }, 1000 * 10);
};

