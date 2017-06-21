var timeInterval, logId;

exports.bindings = {
    state: false,
    download: false,
    attachment: false,
    startProgress: 'startProgress'
};
exports.components = [function() {
    return {
        id: 'player',
        name: 'videojs',
        options: {
            video: {
                // height: 500, // 自动缩放 aspectRatio
                autoplay: true
            },
        }
    };
}];

exports.dataForTemplate = {
    url: function(data) {
        var path = data.attachment.path;
        return '/' + path + '?type=mp4';
    }
};

exports.beforeClose = function() {
    clearInterval(timeInterval);
    this.commitProgress();
};

exports.afterRender = function() {
    var me = this;
    timeInterval = setInterval(function() {
        var flag = me.commitProgress();
        if (flag) me.module.dispatch('startProgress');
    }, 1000 * 60);

    window.onbeforeunload = function() {
        me.commitProgress();
    };
    return this.module.dispatch('startProgress');
};
exports.video = {
    ended: function() {
        var flag = this.commitProgress();
        if (flag) this.module.dispatch('startProgress');
    },
    seeked: function(player) {
        player.play();
    },
    loadeddata: function(player) {
        var state = this.bindings.state.data;
        var duration = Math.floor(player.duration());
        var localLocation = 0;
        if (state.progress) {
            localLocation = state.progress.lessonLocation;
        }
        if ((duration - localLocation) < 2) {
            localLocation = 0;
        }
        player.currentTime(localLocation);
        // this.module.dispatch('duration', { duration: duration });
    }
};

exports.mixin = {
    commitProgress: function() {
        var player = this.components.player;
        var time = player.getLearnTime();
        var resourceTotalTime = Math.floor(player.duration());
        var process = {
            logId: logId,
            lessonLocation: Math.floor(player.currentTime()),
            studyTime: player.getLearnTime(),
            resourceTotalTime: resourceTotalTime,
        };
        if (time < 1) return false;
        if (resourceTotalTime === 0) return false;
        return this.chain([
            this.module.dispatch('updateProgress', process),
            function() { player.resetLearnTime(); }
        ]);
    }
};

exports.startProgress = function() {
    logId = this.bindings.startProgress.data.id;
};
