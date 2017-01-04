var D = require('drizzlejs'),
    WaveSurfer = require('wavesurfer.js');
var wavesurfetKit = function() {
    var beginTime;
    var learnTime = 0;
    var audioprocess = function(t) {
        var minusTime;
        if (!beginTime) {
            beginTime = t;
        }
        minusTime = Math.abs(t - beginTime);
        beginTime = t;
        if (minusTime > 10) return;
        learnTime += minusTime;
    };
    var getLearnTime = function() {
        return learnTime;
    };
    return {
        audioprocess: audioprocess,
        getLearnTime: getLearnTime,
    };
};

D.ComponentManager.register('audio-waveform', function(view, el, options) {
    var wavesurfer,
        kit = wavesurfetKit(),
        opt = {
            waveColor: 'red',
            progressColor: 'purple'
        };
    var events = ['loading', 'pause', 'play', 'ready', 'finish', 'error', 'audioprocess', 'seek', 'scroll', 'zoom'];
    D.assign(opt, options.opt, { container: el });

    wavesurfer = WaveSurfer.create(opt);
    wavesurfer.load(options.url);
    if (view.options.audio) {
        events.forEach(function(e) {
            if (view.options.audio && view.options.audio[e]) {
                wavesurfer.on(e, view.options.audio[e].bind(view));
            }
        });
    }
    wavesurfer.on('audioprocess', kit.audioprocess);
    wavesurfer.getLearnTime = kit.getLearnTime;
    return wavesurfer;
}, function(view, wavesurfer) {
    wavesurfer.destroy();
});
