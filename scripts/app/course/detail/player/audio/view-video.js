exports.components = [{
    id: 'waveform',
    name: 'audio-waveform',
    options: {
        url: 'http://devtest.qiniudn.com/Preparation.mp3',
        playPoint: 65.3333, // 播放开始的位置
        opt: {
            height: 400,
            barWidth: 2,
            cursorWidth: 2,
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
