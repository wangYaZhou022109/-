exports.components = [{
    id: 'waveform',
    name: 'audio-waveform',
    options: {
        url: 'http://devtest.qiniudn.com/Preparation.mp3',
        opt: {
            height: 400,
            barWidth: 2,
            cursorWidth: 0,
        }
    }
}];

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
    this.module.dispatch('updateLearnTime', { learnTime: learnTime, totalTime: totalTime });
};

// 支持的事件 loading,ready,play,pause,finish,error
exports.audio = {
    loading: function(process) {
        console.log('loading:', this, process);
    },
    ready: function() {
        console.log('ready');
        this.components.waveform.play(65.3333); // 加载完成自动播放 。可以注释之后不播放
    }
};
