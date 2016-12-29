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
var voideKit = function(player) {
    return (function(p) {
        var beginTime = -1;
        var learnTime = -1;
        var init = function() {
            learnTime = 0;
        };
        var begin = function() {
            beginTime = p.currentTime();
        };
        var end = function() {
            learnTime += (p.currentTime() - beginTime);
            beginTime = p.currentTime(); // 重置开始时间
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
    }(player));
};

D.ComponentManager.register('videojs', function(view, el, options) {
    var handle = handlerView(view);
    var opt = {
        controls: true,
        loop: false,
        techOrder: ['html5', 'flash'],
        plugins: {}
    };
    return videojs(el, D.assign(opt, options.video), function() {
        var kit = voideKit(this);
        this.on('playing', kit.begin);
        this.on('pause', kit.end);
        this.getLearnTime = kit.getLearnTime;
        if (options.currentTime) this.currentTime(options.currentTime);
        if (view.options.video) {
            this.on('timeupdate', handle(view.options.video.timeupdate));
            this.on('pause', handle(view.options.video.pause));
            this.on('playing', handle(view.options.video.playing));
            this.on('ended', handle(view.options.video.ended));
            this.on('error', handle(view.options.video.error));
            this.on('seeking', handle(view.options.video.seeking));
            this.on('seeked', handle(view.options.video.seeked));
            this.on('loadstart', handle(view.options.video.loadstart));
        }
        if (options.callbacks) options.callbacks.call(view, this);
    });
}, function(view, comp) {
    comp.dispose();
});
