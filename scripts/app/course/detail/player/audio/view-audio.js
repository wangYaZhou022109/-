exports.bindings = {
    section: true,
    sectionProgress: true,
    download: false
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
    var learnTime = this.components.waveform.getLearnTime(),
        totalTime = this.components.waveform.getDuration();
    console.log({ learnTime: learnTime, totalTime: totalTime });
    this.module.dispatch('updatePregress', { learnTime: learnTime, totalTime: totalTime });
};

// 支持的事件 loading,ready,play,pause,finish,error
exports.audio = {
    loading: function(process) {
        console.log('loading:', process);
    },
    ready: function() {
        var sectionProgress = this.bindings.sectionProgress.data || {},
            lessonLocation = sectionProgress.lessonLocation || 0;
        this.components.waveform.play(lessonLocation); // 加载完成自动播放 。可以注释之后不播放
    }
};
