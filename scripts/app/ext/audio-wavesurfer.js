var D = require('drizzlejs'),
    WaveSurfer = require('wavesurfer.js');
var wavesurfetKit = function(wavesurfet) {
    return (function(wf) {
        var beginTime = -1;
        var learnTime = -1;
        var init = function() {
            learnTime = 0;
        };
        var begin = function() {
            beginTime = wf.getCurrentTime();
        };
        var end = function() {
            learnTime += (wf.getCurrentTime() - beginTime);
            beginTime = wf.getCurrentTime(); // 重置开始时间
        };
        var getLearnTime = function() {
            end();
            return learnTime;
        };

        return {
            init: init,
            begin: begin,
            end: end,
            getLearnTime: getLearnTime,
        };
    }(wavesurfet));
};

D.ComponentManager.register('audio-waveform', function(view, el, options) {
    var wavesurfer,
        kit,
        opt = {
            waveColor: 'red',
            progressColor: 'purple'
        };
    D.assign(opt, options.opt, { container: el });
    wavesurfer = WaveSurfer.create(opt);
    wavesurfer.load(options.url);
    kit = wavesurfetKit(wavesurfer);
    wavesurfer.on('ready', function() {
        wavesurfer.setVolume(1);
        wavesurfer.play(options.playPoint);
        kit.init();
    });
    wavesurfer.on('play', kit.begin);
    wavesurfer.on('pause', kit.end);    // 结束播放也会触发暂停事件
    wavesurfer.getLearnTime = kit.getLearnTime;
    return wavesurfer;
}, function(view, wavesurfer) {
    wavesurfer.destroy();
});
