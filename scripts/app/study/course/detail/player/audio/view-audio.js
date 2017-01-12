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
        beginTime = me.bindings.time.data,
        studyTime = this.components.waveform.getLearnTime() + 0.1,
        totalTime = this.components.waveform.getDuration() + 0.1,
        lessonLocation = this.components.waveform.getCurrentTime();
    var callback = this.module.renderOptions.callback;

    me.module.dispatch('updateProgress', {
        beginTime: beginTime,
        studyTime: Math.ceil(studyTime),
        resourceTotalTime: Math.ceil(totalTime),
        lessonLocation: Math.ceil(lessonLocation),
        clientType: 0,
    }).then(function() { callback(); });
};

// 支持的事件 loading,ready,play,pause,finish,error
exports.audio = {
    loading: function(value) {
        this.$('progress').value = value;
    },
    ready: function() {
        var section = this.bindings.state.data.section;
        var currentTime = 0;
        this.$('progress').hidden = true;
        if (section && section.progress) {
            currentTime = section.progress.lessonLocation;
        }
        this.components.waveform.play(Number(currentTime));
    }
};
