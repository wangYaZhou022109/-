// http://docs.videojs.com/docs/guides/setup.html
var D = require('drizzlejs'),
    videojs = require('video.js'),
    handlerView = function(view) {
        return function(method) {
            return function() {
                if (method) {
                    Array.prototype.unshift.call(arguments, this);
                    method.apply(view, arguments);
                }
            };
        };
    };
var initVideo = function(payload) {
    var beginTime;
    var learnTime;
    payload.on('timeupdate', function() {
        var now = new Date().getTime();
        beginTime = beginTime || now;
        learnTime = learnTime || 0;
        learnTime += (now - beginTime);
        beginTime = now;
    });

    payload.on('end', function() {
        beginTime = 0;
    });
    payload.on('pause', function() {
        beginTime = 0;
    });

    return {
        getLearnTime: function() {
            return Math.floor(learnTime / 1000) || 0;
        },
        resetLearnTime: function() {
            // 重制learnTime
            learnTime = 0;
        }
    };
};

D.ComponentManager.register('videojs', function(view, el, options) {
    var handle = handlerView(view);
    var opt = {
        controlBar: {
            currentTimeDisplay: true,
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false
        },
        controls: true,
        loop: false,
        techOrder: ['html5', 'flash']
    };
    return videojs(el, D.assign(opt, options.video), function() {
        D.assign(this, initVideo(this));
        if (options.currentTime) {
            this.currentTime(options.currentTime);
        }
        if (view.options.video) {
            this.on('timeupdate', handle(view.options.video.timeupdate));
            this.on('pause', handle(view.options.video.pause));
            this.on('playing', handle(view.options.video.playing));
            this.on('ended', handle(view.options.video.ended));
            this.on('error', handle(view.options.video.error));
            this.on('seeking', handle(view.options.video.seeking));
            this.on('seeked', handle(view.options.video.seeked));
            this.on('loadeddata', handle(view.options.video.loadeddata));
        }
        if (options.callbacks) options.callbacks.call(view, this);
    });
}, function(view, comp) {
    comp.dispose();
});
