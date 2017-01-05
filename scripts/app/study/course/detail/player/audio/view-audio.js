exports.bindings = {
    section: true,
    sectionProgress: true,
    download: false,
    time: false
};

exports.components = [
    function() {
        var section = this.bindings.section.data || {},
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
        endTime = 0,
        studyTime = this.components.waveform.getLearnTime() + 0.1,
        totalTime = this.components.waveform.getDuration() + 0.1,
        progressRate = Math.ceil((studyTime * 100) / totalTime),
        lessonLocation = this.components.waveform.getCurrentTime();

    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        me.module.dispatch('updatePregress', {
            beginTime: beginTime,
            endTime: endTime,
            studyTime: Math.ceil(studyTime),
            resourceTotalTime: Math.ceil(totalTime),
            progressRate: progressRate,
            lessonLocation: lessonLocation
        });
    });
};

// 支持的事件 loading,ready,play,pause,finish,error
exports.audio = {
    loading: function() {
    },
    ready: function() {
        var sectionProgress = this.bindings.sectionProgress.data || {},
            lessonLocation = sectionProgress.lessonLocation || 0;
        this.components.waveform.play(Number(lessonLocation)); // 加载完成自动播放 。可以注释之后不播放
    }
};
